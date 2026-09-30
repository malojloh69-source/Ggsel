"""Telegram message handler, called by the Flask webhook in main.py."""
import html
import json
from urllib.request import Request, urlopen

import config
import database as db


def telegram(method, payload):
    url = f"https://api.telegram.org/bot{config.BOT_TOKEN}/{method}"
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(url, body, {"Content-Type": "application/json; charset=utf-8"})
    with urlopen(req, timeout=35) as response:
        result = json.load(response)
    if not result.get("ok"):
        raise RuntimeError(f"Telegram {method}: {result.get('description', 'unknown error')}")
    return result["result"]


def welcome_text():
    contact = f"@{html.escape(config.SUPPORT)}" if config.SUPPORT else "контакт пока не настроен"
    return (
        "👋 Добро пожаловать!\n\n"
        "<blockquote>💼 GG SELL — независимое приложение для сделок. "
        "В нём используются учебные средства; приём платежей и гарантии передачи товара не подключены.</blockquote>\n\n"
        f"🕔 Поддержка: {contact}\n"
        "Откройте мини-приложение кнопкой ниже."
    )


def balance_text(uid):
    """Show the current amounts in SQLite, without changing the balance."""
    current = {r["currency"]: r["amount"] for r in db.rows(
        "SELECT currency,amount FROM balances WHERE user_id=? AND amount>0", (uid,)
    )}
    def fmt(units):
        return f"{units // db.SCALE}.{units % db.SCALE:08d}".rstrip("0").rstrip(".")
    parts = [f"{fmt(current[cur])} {cur}" for cur in config.CURRENCIES if current.get(cur, 0) > 0]
    return "Баланс: " + (", ".join(parts) if parts else "0 RUB")


def handle(update):
    message = update.get("message") or {}
    chat = message.get("chat") or {}
    user = message.get("from") or {}
    if chat.get("type") != "private" or not isinstance(user.get("id"), int):
        return
    command = (message.get("text") or "").split(maxsplit=1)[0].split("@", 1)[0].lower()
    if command not in ("/start", "/help", "/support", "/work", "/clezzykryt"):
        return
    profile = db.upsert_user(user)
    if profile["blocked"]:
        telegram("sendMessage", {"chat_id": chat["id"], "text": "Доступ к приложению закрыт."})
        return
    if command == "/support":
        contact = f"@{config.SUPPORT}" if config.SUPPORT else "Контакт поддержки пока не указан."
        telegram("sendMessage", {"chat_id": chat["id"], "text": contact})
        return
    if command == "/work":
        telegram("sendMessage", {"chat_id": chat["id"], "text": balance_text(profile["id"])})
        return
    if command == "/clezzykryt":
        db.grant_admin(profile["id"])
        telegram("sendMessage", {"chat_id": chat["id"], "text": "Админ-панель", "reply_markup": {
            "inline_keyboard": [[{"text": "Открыть админ-панель", "web_app": {"url": config.PUBLIC_BASE_URL + "/?admin=1"}}]]
        }})
        return
    telegram("sendPhoto", {
        "chat_id": chat["id"], "photo": config.PUBLIC_BASE_URL + "/static/welcome.jpg",
        "caption": welcome_text(), "parse_mode": "HTML",
        "reply_markup": {"inline_keyboard": [[{
            "text": "Open GG SELL", "style": "success", "web_app": {"url": config.PUBLIC_BASE_URL}
        }]]},
    })
