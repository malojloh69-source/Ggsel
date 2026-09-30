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


def handle(update):
    message = update.get("message") or {}
    chat = message.get("chat") or {}
    user = message.get("from") or {}
    if chat.get("type") != "private" or not isinstance(user.get("id"), int):
        return
    command = (message.get("text") or "").split(maxsplit=1)[0].split("@", 1)[0].lower()
    if command not in ("/start", "/help", "/support"):
        return
    profile = db.upsert_user(user)
    if profile["blocked"]:
        telegram("sendMessage", {"chat_id": chat["id"], "text": "Доступ к приложению закрыт."})
        return
    if command == "/support":
        contact = f"@{config.SUPPORT}" if config.SUPPORT else "Контакт поддержки пока не указан."
        telegram("sendMessage", {"chat_id": chat["id"], "text": contact})
        return
    telegram("sendMessage", {
        "chat_id": chat["id"], "text": welcome_text(), "parse_mode": "HTML",
        "reply_markup": {"inline_keyboard": [[{
            "text": "Open GG SELL", "web_app": {"url": config.PUBLIC_BASE_URL}
        }]]},
    })

