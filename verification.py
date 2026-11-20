"""Two-step verification of virtual deals. Never accepts money or identity documents."""
import logging
import re
import threading
import time
from decimal import Decimal

import config
import database as db

# Fixed virtual equivalents from the approved prototype, not live exchange rates.
THRESHOLDS = {
    "RUB": "1000.00", "UAH": "551.73", "KZT": "5421.29", "UZS": "146122.14",
    "TON": "11.9453", "USDT": "12.2186", "STARS": "939", "BTC": "0.00019716",
}
MIN_UNITS = {currency: int(Decimal(value) * db.SCALE) for currency, value in THRESHOLDS.items()}
DEMO_NOTE = "Демо: сделки и баланс виртуальные. Переводы денег и передача подарков для верификации не нужны."
LOCK_MESSAGE = "Демо-верификация: необходимо подтверждение администратора."
LOG = logging.getLogger(__name__)


def status(uid, c=None, exempt=None):
    own = c is None
    c = c or db.conn()
    try:
        if exempt is None:
            exempt = c.execute("SELECT 1 FROM admins WHERE user_id=? UNION ALL "
                               "SELECT 1 FROM workers WHERE user_id=? LIMIT 1", (uid, uid)).fetchone() is not None
        approved = c.execute("SELECT approved_at FROM verification_approvals WHERE user_id=?", (uid,)).fetchone()
        totals = c.execute("SELECT currency,amount FROM deals WHERE status='completed' "
                           "AND (seller_id=? OR buyer_id=?)", (uid, uid)).fetchall()
        qualified = sum(row["amount"] >= MIN_UNITS.get(row["currency"], 10**30) for row in totals)
        enabled = config.PAYMENT_MODE == "sandbox"
        stage = ("disabled" if not enabled else "exempt" if exempt else "verified" if approved
                 else "support" if qualified >= 2 else "deals" if totals else "none")
        return {"enabled": enabled, "stage": stage, "locked": stage == "support",
                "qualified_deals": qualified, "completed_deals": len(totals), "required_deals": 2,
                "approved_at": approved["approved_at"] if approved else None,
                "thresholds": THRESHOLDS, "support": config.SUPPORT}
    finally:
        if own:
            c.close()


def approve(uid, admin_id):
    with db.tx() as c:
        if not c.execute("SELECT 1 FROM users WHERE id=?", (uid,)).fetchone():
            raise LookupError("Пользователь не найден")
        current = status(uid, c)
        if current["stage"] == "verified":
            return current
        if current["stage"] != "support":
            raise ValueError("Сначала завершите два подходящих виртуальных обмена")
        c.execute("INSERT INTO verification_approvals(user_id,approved_by,approved_at) VALUES(?,?,?)",
                  (uid, admin_id, int(time.time())))
        return status(uid, c)


def lock_notice():
    buttons = [[{"text": "Открыть верификацию", "web_app": {"url": config.PUBLIC_BASE_URL}}]]
    if re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{4,31}", config.SUPPORT or ""):
        buttons.append([{"text": "Написать в поддержку", "url": "https://t.me/" + config.SUPPORT}])
    return {
        "text": "Демо-верификация\n\nДве виртуальные сделки проверены. "
                "Доступ временно ограничен до подтверждения администратором.\n\n" + DEMO_NOTE,
        "reply_markup": {"inline_keyboard": buttons},
    }


def notify(uid):
    """Claim one notice per user; Telegram failures never roll back a completed deal."""
    if not config.BOT_TOKEN:
        return
    with db.tx() as c:
        if not status(uid, c)["locked"]:
            return
        claimed = c.execute("INSERT OR IGNORE INTO verification_notices(user_id,created) VALUES(?,?)",
                            (uid, int(time.time()))).rowcount
    if not claimed:
        return
    try:
        import bot
        bot.telegram("sendMessage", {"chat_id": uid, **lock_notice()})
    except Exception:
        with db.tx() as c:
            c.execute("DELETE FROM verification_notices WHERE user_id=?", (uid,))
        LOG.exception("Could not send verification notice for user %s", uid)


def notify_deal(deal):
    if config.BOT_TOKEN and deal["status"] == "completed":
        for uid in {deal["seller_id"], deal["buyer_id"]} - {None}:
            threading.Thread(target=notify, args=(uid,), daemon=True).start()
