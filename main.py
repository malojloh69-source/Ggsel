import hashlib
import hmac
import json
import logging
import os
import re
import secrets
import sqlite3
import time
import threading
from decimal import Decimal, InvalidOperation
from functools import wraps
from urllib.parse import parse_qsl

from flask import Flask, g, jsonify, request, send_from_directory

import config
import database as db

# Быстрые настройки: укажите значения в кавычках, без @; пусто — значение из .env.
BOT_USERNAME = ""      # Юз бота — например, "my_deals_bot".
SUPPORT_USERNAME = ""  # Юз поддержки — например, "my_support".
APP_SHORT_NAME = ""    # Короткое имя Mini App, если настроено в BotFather.
PUBLIC_BASE_URL = ""   # Адрес Bothost — например, "https://bot-123.bothost.tech".

config.BOT_USERNAME = (BOT_USERNAME or config.BOT_USERNAME).lstrip("@")
config.SUPPORT = (SUPPORT_USERNAME or config.SUPPORT).lstrip("@")
config.APP_SHORT_NAME = (APP_SHORT_NAME or config.APP_SHORT_NAME).strip().strip("/")
config.PUBLIC_BASE_URL = (PUBLIC_BASE_URL or config.PUBLIC_BASE_URL).rstrip("/")

BASE = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)
LOG = logging.getLogger(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024
ASSETS = {"style.css", "script.js", "brand.png", "favicon.svg", "lottie-player.js", "welcome.mp4"}
db.init()

SC = db.SCALE
FINAL = ("completed", "cancelled")
KINDS = ("card", "ton", "usdt")
NFT_RE = re.compile(r"^https://t\.me/nft/[A-Za-z0-9_]{2,64}-\d{1,12}$")
ID_RE = re.compile(r"^[A-F0-9]{24}$")


# ---------------------------------------------------------------- helpers
def err(msg, code=400):
    return jsonify(error=msg), code


def clean(v, n):
    v = "" if v is None else str(v)
    return re.sub(r"[\x00-\x08\x0b-\x1f]", "", v).strip()[:n]


def amount(v):
    try:
        d = Decimal(str(v).strip().replace(",", "."))
    except (InvalidOperation, ValueError):
        return None
    if not d.is_finite() or d <= 0 or d > config.MAX_AMOUNT:
        return None
    if d * SC != (d * SC).to_integral_value():
        return None
    a = int(d * SC)
    return a if a > 0 else None


def fmt(v):
    return f"{v // SC}.{v % SC:08d}".rstrip("0").rstrip(".")


def luhn(s):
    t = 0
    for i, ch in enumerate(reversed(s)):
        n = int(ch)
        if i % 2:
            n = n * 2 - 9 if n > 4 else n * 2
        t += n
    return t % 10 == 0


def valid_req(kind, v):
    if kind == "card":
        v = re.sub(r"[ -]", "", v)
        return v if re.fullmatch(r"\d{4}", v) else None
    if kind == "ton":
        return v if re.fullmatch(r"[A-Za-z0-9_-]{48}", v) else None
    if kind == "usdt":
        return v if re.fullmatch(r"T[1-9A-HJ-NP-Za-km-z]{33}", v) else None
    return None


def verify_init_data(raw):
    """Validate the signed Telegram payload; never trust initDataUnsafe."""
    try:
        if not isinstance(raw, str) or len(raw) > 16000:
            return None
        parsed = parse_qsl(raw, keep_blank_values=True, strict_parsing=True)
        pairs = dict(parsed)
        if len(parsed) != len(pairs):
            return None
        h = pairs.pop("hash", "")
        check = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
        secret = hmac.new(b"WebAppData", config.BOT_TOKEN.encode(), hashlib.sha256).digest()
        calc = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(calc, h):
            return None
        age = time.time() - int(pairs.get("auth_date", 0))
        if age < -30 or age > config.INITDATA_TTL:
            return None
        user = json.loads(pairs["user"])
        if not isinstance(user, dict) or type(user.get("id")) is not int or not 0 < user["id"] < 2**53:
            return None
        return user
    except (ValueError, TypeError, KeyError, OverflowError):
        return None


def auth(admin=False, worker=False):
    def deco(f):
        @wraps(f)
        def w(*a, **kw):
            raw = request.headers.get("X-Init-Data", "")
            if config.DEV_MODE and not raw:
                uid = request.headers.get("X-Dev-User", "1")
                uid = int(uid) if uid in ("1", "2", "3") else 1
                tg = {"id": uid, "username": f"dev{uid}", "first_name": {1: "Тестовый продавец", 2: "Тестовый покупатель", 3: "Тестовый участник"}[uid]}
            else:
                tg = verify_init_data(raw) if config.BOT_TOKEN else None
            if not tg:
                return err("Откройте приложение через Telegram", 401)
            u = db.upsert_user(tg)
            if u["blocked"]:
                return err("Аккаунт заблокирован", 403)
            g.user = u
            g.is_admin = db.is_admin(u["id"])
            g.is_worker = db.is_worker(u["id"])
            if admin and not g.is_admin:
                return err("Нет доступа", 403)
            if worker and not g.is_worker:
                return err("Нет доступа", 403)
            return f(*a, **kw)
        return w
    return deco


def pub(uid):
    if not uid:
        return None
    u = db.row("SELECT id,username,first_name FROM users WHERE id=?", (uid,))
    if not u:
        return None
    return {"id": u["id"], "name": "@" + u["username"] if u["username"] else (u["first_name"] or f"ID {u['id']}")}


def allowed(d, uid):
    st, s, b, cr = d["status"], d["seller_id"], d["buyer_id"], d["creator_id"]
    if st in ("created", "waiting_participant"):
        if uid == cr:
            return ["cancel"]
        return []
    if st == "waiting_payment":
        return ["pay", "cancel"] if uid == b else ["cancel"] if uid == s else []
    if st == "paid":
        return ["confirm"] if uid == b else ["refund"] if uid == s else []
    return []


def deal_view(d, uid):
    nft = json.loads(d["nft"] or "[]")
    reviewable = (
        d["status"] == "completed"
        and uid in (d["seller_id"], d["buyer_id"])
    )
    return {
        "id": d["id"], "join_code": d["join_code"],
        "status": d["status"], "amount": fmt(d["amount"]), "currency": d["currency"],
        "description": d["description"], "nft": nft, "created": d["created"],
        "title": (d["description"] or "")[:40] or f"NFT-подарки ({len(nft)})",
        "seller": pub(d["seller_id"]), "buyer": pub(d["buyer_id"]),
        "actions": allowed(d, uid), "is_creator": uid == d["creator_id"], "can_review": bool(reviewable),
        "payment_mode": config.PAYMENT_MODE,
        "updated": d["updated"],
        "events": db.rows("SELECT id,status,created FROM deal_events WHERE deal_id=? ORDER BY id", (d["id"],)),
    }


@app.after_request
def secure(r):
    r.headers["X-Content-Type-Options"] = "nosniff"
    r.headers["Referrer-Policy"] = "no-referrer"
    r.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    sp = "'self' https://telegram.org" + (f" 'nonce-{g.nonce}'" if "nonce" in g else "")
    r.headers["Content-Security-Policy"] = (
        f"default-src 'self'; script-src {sp}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ddejfvww7sqtk.cloudfront.net; object-src 'none'; base-uri 'self'; form-action 'self'"
    )
    if request.path == "/" or request.path.startswith("/api") or request.path.startswith("/static/"):
        r.headers["Cache-Control"] = "no-store"
    return r


@app.get("/")
def index():
    g.nonce = secrets.token_urlsafe(16)
    with open(os.path.join(BASE, "index.html"), encoding="utf-8") as f:
        html = f.read().replace("__NONCE__", g.nonce).replace(
            "window.__PYTHON_CONFIG__", json.dumps({"preview": False, "dev": config.DEV_MODE, "paymentMode": config.PAYMENT_MODE, "support": config.SUPPORT})
        )
    return app.response_class(html, mimetype="text/html")


@app.get("/health")
def site_health():
    return jsonify(ok=True)


def webhook_secret():
    """Stable, unguessable Telegram header secret derived from the server-side token."""
    return hmac.new(config.BOT_TOKEN.encode(), b"gg-sell-telegram-webhook-v1", hashlib.sha256).hexdigest()


@app.post("/telegram/webhook")
def telegram_webhook():
    if not config.BOT_TOKEN or not hmac.compare_digest(
        request.headers.get("X-Telegram-Bot-Api-Secret-Token", ""), webhook_secret()
    ):
        return err("Доступ запрещён", 403)
    update = request.get_json(silent=True)
    if not isinstance(update, dict):
        return err("Некорректное обновление", 400)
    try:
        import bot
        bot.handle(update)
    except Exception:
        LOG.exception("Ошибка обработки Telegram update_id=%s", update.get("update_id"))
        return err("Не удалось обработать обновление", 503)
    return jsonify(ok=True)


def register_webhook():
    """Keep the site available while retrying webhook registration after API failures."""
    import bot
    url = config.PUBLIC_BASE_URL + "/telegram/webhook"
    while True:
        try:
            bot_info = bot.telegram("getMe", {})
            if not config.BOT_USERNAME:
                config.BOT_USERNAME = bot_info["username"].lstrip("@")
            bot.telegram("setWebhook", {
                "url": url,
                "secret_token": webhook_secret(),
                "allowed_updates": ["message"],
            })
            LOG.info("Telegram webhook registered at %s", url)
            return
        except Exception:
            LOG.exception("Telegram webhook registration failed; retrying in 15 seconds")
            time.sleep(15)


@app.get("/static/<name>")
def assets(name):
    # Only allow listed public assets.
    if name in ASSETS:
        for folder in (os.path.join(BASE, "static"), BASE):
            if os.path.isfile(os.path.join(folder, name)):
                return send_from_directory(folder, name)
    return err("Не найдено", 404)


@app.get("/static/gifts/<name>")
def gift_animation(name):
    if not re.fullmatch(r"\d{2}\.json", name):
        return err("Не найдено", 404)
    return send_from_directory(os.path.join(BASE, "static", "gifts"), name, mimetype="application/json")


# ---------------------------------------------------------------- user
@app.get("/api/me")
@auth()
def me():
    u = g.user
    uid = u["id"]
    bal = {c: "0" for c in config.CURRENCIES}
    for r in db.rows("SELECT currency,amount FROM balances WHERE user_id=?", (uid,)):
        bal[r["currency"]] = fmt(r["amount"])
    done = db.rows(
        "SELECT currency, SUM(amount) s, COUNT(*) n FROM deals WHERE status='completed' AND (seller_id=? OR buyer_id=?) GROUP BY currency",
        (uid, uid),
    )
    active = db.row(
        "SELECT COUNT(*) n FROM deals WHERE status NOT IN ('completed','cancelled') AND (seller_id=? OR buyer_id=?)",
        (uid, uid),
    )["n"]
    rating = db.row("SELECT AVG(rating) value, COUNT(*) n FROM reviews WHERE target_id=?", (uid,))
    test_stats = db.row("SELECT completed_count,rating_tenths FROM worker_stats WHERE user_id=?", (uid,)) if g.is_worker and config.PAYMENT_MODE == "sandbox" else None
    completed = sum(r["n"] for r in done)
    return jsonify(
        user={"id": uid, "username": u["username"], "name": u["first_name"], "photo": u["photo"]},
        is_admin=g.is_admin, is_worker=g.is_worker, balances=bal,
        support=config.SUPPORT, demo=config.DEV_MODE, payment_mode=config.PAYMENT_MODE, auth_verified=not config.DEV_MODE,
        stats={
            "active": active,
            "rating": round(rating["value"], 1) if rating["n"] else None, "reviews": rating["n"],
            "test_completed": completed + (test_stats["completed_count"] if test_stats else 0),
            "test_rating": test_stats["rating_tenths"] / 10 if test_stats else None,
            "turnover": {r["currency"]: fmt(r["s"]) for r in done},
        },
    )


@app.get("/api/home")
@auth()
def home():
    uid = g.user["id"]
    ds = db.rows("SELECT * FROM deals WHERE seller_id=? OR buyer_id=? ORDER BY created DESC LIMIT 5", (uid, uid))
    return jsonify(deals=[deal_view(d, uid) for d in ds], reviews=[])


@app.route("/api/reviews/mine", methods=["GET", "POST"])
@auth()
def site_review():
    if request.method == "GET":
        return jsonify(None)
    return err("Неизвестная ошибка, попробуйте позже", 503)


# ---------------------------------------------------------------- worker sandbox
@app.post("/api/worker/activate")
@auth()
def activate_worker():
    # The /work button opens ?worker=1; activation binds access to this authenticated user.
    db.grant_worker(g.user["id"])
    return jsonify(ok=True)


@app.get("/api/worker")
@auth(worker=True)
def worker_panel():
    uid = g.user["id"]
    balances = {r["currency"]: fmt(r["amount"]) for r in db.rows(
        "SELECT currency,amount FROM balances WHERE user_id=? AND amount>0", (uid,)
    )}
    stats = db.row("SELECT completed_count,rating_tenths FROM worker_stats WHERE user_id=?", (uid,))
    return jsonify(payment_mode=config.PAYMENT_MODE, balances=balances,
                   test_stats={"completed": stats["completed_count"], "rating": stats["rating_tenths"] / 10} if stats else None)


@app.post("/api/worker/stats")
@auth(worker=True)
def worker_stats():
    if config.PAYMENT_MODE != "sandbox":
        return err("Тестовые показатели отключены", 403)
    data = request.get_json(silent=True) or {}
    count = data.get("completed")
    try:
        value = Decimal(str(data.get("rating")))
    except (InvalidOperation, ValueError):
        return err("Рейтинг должен быть от 0 до 5 с одним знаком после запятой")
    if type(count) is not int or not 0 <= count <= 1000000:
        return err("Количество сделок должно быть целым числом от 0 до 1 000 000")
    if not value.is_finite() or not 0 <= value <= 5 or value * 10 != (value * 10).to_integral_value():
        return err("Рейтинг должен быть от 0 до 5 с одним знаком после запятой")
    tenths = int(value * 10)
    with db.tx() as c:
        c.execute("INSERT INTO worker_stats(user_id,completed_count,rating_tenths) VALUES(?,?,?) "
                  "ON CONFLICT(user_id) DO UPDATE SET completed_count=excluded.completed_count,rating_tenths=excluded.rating_tenths",
                  (g.user["id"], count, tenths))
    return jsonify(ok=True, test_stats={"completed": count, "rating": tenths / 10})


@app.post("/api/worker/credit")
@auth(worker=True)
def worker_credit():
    if config.PAYMENT_MODE != "sandbox":
        return err("Тестовые начисления отключены", 403)
    j = request.get_json(silent=True) or {}
    amt, cur = amount(j.get("amount")), j.get("currency")
    if not amt or cur not in config.CURRENCIES or amt > 1000000 * SC:
        return err("Тестовая сумма: от 0 до 1 000 000")
    if cur in ("RUB", "UAH", "KZT", "UZS") and amt % (SC // 100):
        return err("Для этой валюты доступны два знака после запятой")
    try:
        with db.tx() as c:
            db.move(c, g.user["id"], cur, amt)
            db.log(c, g.user["id"], "worker_credit", cur, amt, "done", "Тестовые средства. Не являются деньгами.")
    except ValueError as exc:
        return err(str(exc))
    return jsonify(ok=True)


@app.post("/api/worker/reviews")
@auth(worker=True)
def worker_reviews():
    return err("Неизвестная ошибка, попробуйте позже", 503)


@app.delete("/api/worker/reviews")
@auth(worker=True)
def delete_worker_review():
    return err("Неизвестная ошибка, попробуйте позже", 503)


# ---------------------------------------------------------------- deals
@app.post("/api/deals")
@auth()
def create_deal():
    j = request.get_json(silent=True) or {}
    uid = g.user["id"]
    role = j.get("role")
    amt = amount(j.get("amount"))
    cur = j.get("currency")
    if amt and cur in ("RUB", "UAH", "KZT", "UZS") and amt % (SC // 100):
        return err("Для этой валюты доступны два знака после запятой")
    if amt and cur == "STARS" and amt % SC:
        return err("Количество Stars должно быть целым")
    desc = clean(j.get("description"), 500)
    raw = j.get("nft") if isinstance(j.get("nft"), list) else []
    nft = []
    for u in raw[:40]:
        u = clean(u, 120)
        if not NFT_RE.match(u):
            return err(f"Некорректная NFT-ссылка: {u[:40]}")
        if u not in nft:
            nft.append(u)
    if role not in ("seller", "buyer"):
        return err("Выберите роль")
    if amt is None:
        return err("Введите корректную сумму")
    if cur not in config.CURRENCIES:
        return err("Выберите валюту")
    if len(desc) < 3 and not nft:
        return err("Опишите товар или услугу либо добавьте NFT-ссылки")
    if db.row(
        "SELECT COUNT(*) n FROM deals WHERE creator_id=? AND status IN ('created','waiting_participant')", (uid,)
    )["n"] >= 30:
        return err("Слишком много неподтверждённых сделок")
    did = secrets.token_hex(12).upper()
    now = int(time.time())
    with db.tx() as c:
        code = db.new_join_code(c)
        c.execute(
            "INSERT INTO deals(id,creator_id,seller_id,buyer_id,amount,currency,description,nft,status,created,updated,join_code) "
            "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
            (did, uid, uid if role == "seller" else None, uid if role == "buyer" else None,
             amt, cur, desc, json.dumps(nft), "waiting_participant", now, now, code),
        )
        d = dict(c.execute("SELECT * FROM deals WHERE id=?", (did,)).fetchone())
    return jsonify(deal_view(d, uid))


@app.get("/api/deals")
@auth()
def list_deals():
    uid = g.user["id"]
    extra = {"active": "AND status NOT IN ('completed','cancelled')", "done": "AND status='completed'"}.get(
        request.args.get("filter"), "")
    ds = db.rows(
        f"SELECT * FROM deals WHERE (seller_id=? OR buyer_id=?) {extra} ORDER BY created DESC LIMIT 100", (uid, uid)
    )
    return jsonify([deal_view(d, uid) for d in ds])


@app.get("/api/deals/<did>")
@auth()
def get_deal(did):
    did = did.upper()
    d = ID_RE.match(did) and db.row("SELECT * FROM deals WHERE id=?", (did,))
    if not d:
        return err("Сделка не найдена", 404)
    if g.user["id"] not in (d["seller_id"], d["buyer_id"]):
        return err("Эта сделка доступна только её участникам", 403)
    return jsonify(deal_view(d, g.user["id"]))


@app.post("/api/deals/join")
@auth()
def join_by_code():
    code = (request.get_json(silent=True) or {}).get("code")
    if not isinstance(code, str) or not re.fullmatch(r"\d{6}", code):
        return err("Введите шестизначный код")
    uid, now = g.user["id"], int(time.time())
    with db.tx() as c:
        attempts = c.execute("SELECT window_start,count FROM join_attempts WHERE user_id=?", (uid,)).fetchone()
        if attempts and now - attempts["window_start"] < 600 and attempts["count"] >= 20:
            return err("Слишком много попыток. Повторите позже", 429)
        if not attempts or now - attempts["window_start"] >= 600:
            c.execute("INSERT INTO join_attempts(user_id,window_start,count) VALUES(?,?,1) "
                      "ON CONFLICT(user_id) DO UPDATE SET window_start=excluded.window_start,count=1", (uid, now))
        else:
            c.execute("UPDATE join_attempts SET count=count+1 WHERE user_id=?", (uid,))
        d = c.execute("SELECT * FROM deals WHERE join_code=?", (code,)).fetchone()
        if not d or d["status"] not in ("created", "waiting_participant") or uid == d["creator_id"]:
            return err("Код не найден или сделка уже недоступна", 404)
        slot = "buyer_id" if d["seller_id"] == d["creator_id"] else "seller_id"
        c.execute(f"UPDATE deals SET {slot}=?,status='waiting_payment',updated=? WHERE id=?",
                  (uid, now, d["id"]))
        d = dict(c.execute("SELECT * FROM deals WHERE id=?", (d["id"],)).fetchone())
    return jsonify(deal_view(d, uid))


@app.post("/api/deals/<did>/<act>")
@auth()
def deal_act(did, act):
    did, uid = did.upper(), g.user["id"]
    if not ID_RE.match(did) or act not in ("pay", "confirm", "refund", "cancel"):
        return err("Некорректный запрос", 404)
    try:
        with db.tx() as c:
            d = c.execute("SELECT * FROM deals WHERE id=?", (did,)).fetchone()
            if not d:
                return err("Сделка не найдена", 404)
            d = dict(d)
            if act not in allowed(d, uid):
                return err("Действие сейчас недоступно", 409)
            amt, cur = d["amount"], d["currency"]
            if act == "pay":
                if config.PAYMENT_MODE != "sandbox":
                    return err("Приём реальных платежей не подключён", 503)
                db.move(c, uid, cur, -amt)
                db.log(c, uid, "deal_pay", cur, amt, "done", ref=did)
                new = "paid"
            elif act == "confirm":
                db.move(c, d["seller_id"], cur, amt)
                db.log(c, d["seller_id"], "deal_release", cur, amt, "done", ref=did)
                new = "completed"
            elif act == "refund":
                db.move(c, d["buyer_id"], cur, amt)
                db.log(c, d["buyer_id"], "deal_refund", cur, amt, "done", ref=did)
                new = "cancelled"
            else:
                new = "cancelled"
            c.execute("UPDATE deals SET status=?, updated=? WHERE id=?", (new, int(time.time()), did))
            d = dict(c.execute("SELECT * FROM deals WHERE id=?", (did,)).fetchone())
    except ValueError as e:
        return err(str(e))
    return jsonify(deal_view(d, uid))


@app.post("/api/deals/<did>/review")
@auth()
def review(did):
    did, uid = did.upper(), g.user["id"]
    d = ID_RE.match(did) and db.row("SELECT * FROM deals WHERE id=?", (did,))
    if not d or uid not in (d["seller_id"], d["buyer_id"]):
        return err("Сделка не найдена", 404)
    return err("Неизвестная ошибка, попробуйте позже", 503)


# ---------------------------------------------------------------- requisites & balance
@app.get("/api/requisites")
@auth()
def get_req():
    r = {k: "" for k in KINDS}
    for x in db.rows("SELECT kind,value FROM requisites WHERE user_id=?", (g.user["id"],)):
        r[x["kind"]] = x["value"]
    return jsonify(r)


@app.put("/api/requisites/<kind>")
@auth()
def put_req(kind):
    if kind not in KINDS:
        return err("Неизвестный тип", 404)
    v = clean((request.get_json(silent=True) or {}).get("value"), 100)
    with db.tx() as c:
        if not v:
            c.execute("DELETE FROM requisites WHERE user_id=? AND kind=?", (g.user["id"], kind))
        else:
            v = valid_req(kind, v)
            if not v:
                return err("Некорректные реквизиты")
            c.execute(
                "INSERT INTO requisites(user_id,kind,value) VALUES(?,?,?) "
                "ON CONFLICT(user_id,kind) DO UPDATE SET value=excluded.value", (g.user["id"], kind, v))
    return jsonify(ok=True)


@app.get("/api/txs")
@auth()
def txs():
    rs = db.rows("SELECT id,type,currency,amount,status,ref,created FROM txs WHERE user_id=? ORDER BY id DESC LIMIT 60",
                 (g.user["id"],))
    for r in rs:
        r["amount"] = fmt(r["amount"])
    return jsonify(rs)


@app.post("/api/txs/deposit")
@auth()
def deposit():
    if config.PAYMENT_MODE != "sandbox":
        return err("Приём заявок сейчас недоступен", 503)
    j = request.get_json(silent=True) or {}
    amt, cur = amount(j.get("amount")), j.get("currency")
    if amt is None or cur not in config.CURRENCIES:
        return err("Проверьте сумму и валюту")
    if cur in ("RUB", "UAH", "KZT", "UZS") and amt % (SC // 100):
        return err("Для этой валюты доступны два знака после запятой")
    comment = clean(j.get("comment"), 160)
    with db.tx() as c:
        db.log(c, g.user["id"], "deposit", cur, amt, "pending", comment)
    return jsonify(ok=True, status="pending")


@app.post("/api/txs/withdraw")
@auth()
def withdraw():
    if config.PAYMENT_MODE != "sandbox":
        return err("Платёжный провайдер не подключён", 503)
    j = request.get_json(silent=True) or {}
    uid, amt, cur, kind = g.user["id"], amount(j.get("amount")), j.get("currency"), j.get("method")
    if not db.row("SELECT 1 FROM deals WHERE status='completed' AND (seller_id=? OR buyer_id=?) LIMIT 1", (uid, uid)):
        return err("Вывод доступен после одной завершённой сделки", 403)
    if amt is None or cur not in config.CURRENCIES or kind not in KINDS:
        return err("Проверьте сумму, валюту и способ вывода")
    rq = db.row("SELECT value FROM requisites WHERE user_id=? AND kind=?", (uid, kind))
    if not rq:
        return err("Сначала добавьте реквизиты для этого способа")
    try:
        with db.tx() as c:
            db.move(c, uid, cur, -amt)  # funds are held until the operator decides
            db.log(c, uid, "withdraw", cur, amt, "pending", f"{kind}: {rq['value']}")
    except ValueError as e:
        return err(str(e))
    return jsonify(ok=True)


# ---------------------------------------------------------------- admin (work panel)
@app.get("/api/admin/users")
@auth(admin=True)
def a_users():
    q = request.args.get("q", "").strip().lstrip("@").lower()[:64]
    us = db.rows(
        "SELECT id,username,first_name,blocked,created FROM users "
        "WHERE (?='' OR instr(lower(coalesce(username,'')),?)>0) ORDER BY created DESC LIMIT 500",
        (q, q),
    )
    bal = {}
    for r in db.rows("SELECT user_id,currency,amount FROM balances WHERE amount>0"):
        bal.setdefault(r["user_id"], {})[r["currency"]] = fmt(r["amount"])
    for u in us:
        u["balances"] = bal.get(u["id"], {})
    return jsonify(us)


@app.get("/api/admin/deals")
@auth(admin=True)
def a_deals():
    ds = db.rows("SELECT * FROM deals ORDER BY created DESC")
    return jsonify([deal_view(d, 0) for d in ds])


@app.get("/api/admin/stats")
@auth(admin=True)
def a_stats():
    users = db.row("SELECT COUNT(*) n FROM users")["n"]
    deals = db.row("SELECT COUNT(*) n FROM deals")["n"]
    completed = db.row("SELECT COUNT(*) n FROM deals WHERE status='completed'")["n"]
    turnover = db.rows("SELECT currency,SUM(amount) total FROM deals WHERE status='completed' GROUP BY currency")
    return jsonify(users=users, deals=deals, completed=completed,
                   turnover={r["currency"]: fmt(r["total"]) for r in turnover})


@app.get("/api/admin/requests")
@auth(admin=True)
def a_requests():
    rs = db.rows("SELECT * FROM txs WHERE status='pending' ORDER BY id DESC LIMIT 100")
    for r in rs:
        r["amount"] = fmt(r["amount"])
    return jsonify(rs)


@app.post("/api/admin/txs/<int:tid>/<act>")
@auth(admin=True)
def a_tx(tid, act):
    if config.PAYMENT_MODE != "sandbox":
        return err("Платёжный провайдер не подключён", 503)
    if act not in ("approve", "reject"):
        return err("Некорректный запрос", 404)
    try:
        with db.tx() as c:
            t = c.execute("SELECT * FROM txs WHERE id=? AND status='pending'", (tid,)).fetchone()
            if not t:
                return err("Заявка не найдена или уже обработана", 404)
            if t["type"] == "deposit" and act == "approve":
                db.move(c, t["user_id"], t["currency"], t["amount"])
            if t["type"] == "withdraw" and act == "reject":
                db.move(c, t["user_id"], t["currency"], t["amount"])
            c.execute("UPDATE txs SET status=? WHERE id=?", ("done" if act == "approve" else "rejected", tid))
    except ValueError as e:
        return err(str(e))
    return jsonify(ok=True)


@app.post("/api/admin/credit")
@auth(admin=True)
def a_credit():
    if config.PAYMENT_MODE != "sandbox":
        return err("Произвольное начисление реальных средств недоступно", 403)
    j = request.get_json(silent=True) or {}
    try:
        uid = int(j.get("user_id"))
    except (TypeError, ValueError):
        return err("Некорректный пользователь")
    amt, cur = amount(j.get("amount")), j.get("currency")
    if amt is None or cur not in config.CURRENCIES:
        return err("Проверьте сумму и валюту")
    if not db.row("SELECT 1 FROM users WHERE id=?", (uid,)):
        return err("Пользователь не найден", 404)
    with db.tx() as c:
        db.move(c, uid, cur, amt)
        db.log(c, uid, "admin_credit", cur, amt, "done", ref=str(g.user["id"]))
    return jsonify(ok=True)


@app.post("/api/admin/users/<int:uid>/block")
@auth(admin=True)
def a_block(uid):
    if db.is_admin(uid):
        return err("Нельзя заблокировать администратора")
    flag = 1 if (request.get_json(silent=True) or {}).get("blocked") else 0
    with db.tx() as c:
        c.execute("UPDATE users SET blocked=? WHERE id=?", (flag, uid))
    return jsonify(ok=True)


@app.post("/api/admin/deals/<did>/status")
@auth(admin=True)
def a_status(did):
    new = (request.get_json(silent=True) or {}).get("status")
    if new not in FINAL:
        return err("Недопустимый статус")
    try:
        with db.tx() as c:
            d = c.execute("SELECT * FROM deals WHERE id=?", (did.upper(),)).fetchone()
            if not d:
                return err("Сделка не найдена", 404)
            if d["status"] in FINAL:
                return err("Сделка уже закрыта")
            if new == "completed":
                if d["status"] != "paid":
                    return err("Завершить можно только оплаченную сделку")
                db.move(c, d["seller_id"], d["currency"], d["amount"])
                db.log(c, d["seller_id"], "deal_release", d["currency"], d["amount"], "done", ref=d["id"])
            elif d["status"] == "paid":
                db.move(c, d["buyer_id"], d["currency"], d["amount"])
                db.log(c, d["buyer_id"], "deal_refund", d["currency"], d["amount"], "done", ref=d["id"])
            c.execute("UPDATE deals SET status=?, updated=? WHERE id=?", (new, int(time.time()), d["id"]))
    except ValueError as e:
        return err(str(e))
    return jsonify(ok=True)


@app.before_request
def validate_request():
    if request.path.startswith("/api/") and request.method in ("POST", "PUT", "PATCH", "DELETE"):
        origin = request.headers.get("Origin")
        if origin and origin not in (request.host_url.rstrip("/"), config.PUBLIC_BASE_URL):
            return err("Недопустимый источник запроса", 403)
        if request.content_length:
            if not request.is_json or not isinstance(request.get_json(silent=True), dict):
                return err("Ожидается JSON-объект", 400)


@app.get("/api/health")
def health():
    return jsonify(ok=True, storage="sqlite", payments=config.PAYMENT_MODE)


@app.post("/api/sandbox/fund")
@auth()
def sandbox_fund():
    if config.PAYMENT_MODE != "sandbox":
        return err("Тестовое пополнение отключено", 403)
    j = request.get_json(silent=True) or {}
    amt, cur = amount(j.get("amount")), j.get("currency")
    if not amt or cur not in config.CURRENCIES or amt > 1000000 * SC:
        return err("Тестовая сумма: от 0 до 1 000 000")
    try:
        with db.tx() as c:
            db.move(c, g.user["id"], cur, amt)
            db.log(c, g.user["id"], "sandbox_credit", cur, amt, "done", "Тестовые средства. Не являются деньгами.")
    except ValueError as e:
        return err(str(e))
    return jsonify(ok=True, payment_mode="sandbox")


@app.get("/api/live")
@auth()
def live():
    # Only the authenticated participant's completed deals; no invented trades,
    # no leaked names, wallet addresses or unrelated private deal IDs.
    uid = g.user["id"]
    ds = db.rows("SELECT * FROM deals WHERE status='completed' AND (seller_id=? OR buyer_id=?) ORDER BY updated DESC LIMIT 20", (uid, uid))
    items = []
    for d in ds:
        for link in json.loads(d["nft"] or "[]"):
            slug, number = link.rsplit("/", 1)[-1].rsplit("-", 1)
            items.append({"deal_id": d["id"], "title": re.sub(r"(?<!^)(?=[A-Z])", " ", slug), "number": number,
                          "url": link, "amount": fmt(d["amount"]), "currency": d["currency"], "completed": d["updated"]})
    rev = db.row("SELECT MAX(e.id) AS n FROM deal_events e JOIN deals d ON d.id=e.deal_id WHERE d.seller_id=? OR d.buyer_id=?", (uid, uid))
    return jsonify(items=items[:20], revision=rev["n"] or 0, server_time=int(time.time()),
                   source="sqlite", payment_mode=config.PAYMENT_MODE)


@app.errorhandler(404)
def nf(_):
    return err("Не найдено", 404)


@app.errorhandler(413)
def big(_):
    return err("Слишком большой запрос", 413)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    if config.DEV_MODE:
        print("ТЕСТОВЫЙ РЕЖИМ: /?dev=1 и /?dev=2. Реальные платежи не подключены.")
    else:
        if not config.BOT_TOKEN or not config.PUBLIC_BASE_URL.startswith("https://"):
            raise SystemExit("Задайте BOT_TOKEN и HTTPS PUBLIC_BASE_URL (домен Bothost).")
        threading.Thread(target=register_webhook, name="telegram-webhook-setup", daemon=True).start()
    from waitress import serve
    serve(app, host=config.HOST, port=config.PORT, threads=8)
