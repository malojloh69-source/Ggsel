"""Server settings. Production never falls back to development authentication."""
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent
# Small .env reader; environment variables always take precedence.
if (BASE / '.env').exists():
    for line in (BASE / '.env').read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            os.environ.setdefault(key.strip(), value.strip().strip('\"\''))

BOT_TOKEN = os.getenv('BOT_TOKEN', '')
BOT_USERNAME = os.getenv('BOT_USERNAME', '').lstrip('@')
APP_SHORT_NAME = os.getenv('APP_SHORT_NAME', '')
SUPPORT = os.getenv('SUPPORT_USERNAME', '').lstrip('@')
DEV_MODE = os.getenv('DEV_MODE') == '1'
ADMIN_IDS = {int(x) for x in os.getenv('ADMIN_IDS', '').split(',') if x.strip().isdigit()}
if DEV_MODE:
    ADMIN_IDS.add(1)
PAYMENT_MODE = os.getenv('PAYMENT_MODE', 'sandbox')
DATA = BASE / 'data'
DATA.mkdir(exist_ok=True)
DB_PATH = os.getenv('DB_PATH', str(DATA / 'app.db'))
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', '3000'))
PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL', '').rstrip('/')
INITDATA_TTL = 3600
MAX_AMOUNT = 10 ** 9
CURRENCIES = ['RUB', 'UAH', 'KZT', 'UZS', 'TON', 'USDT', 'STARS', 'BTC']

if PAYMENT_MODE not in ('sandbox', 'disabled'):
    raise RuntimeError('Реальный платёжный провайдер не подключён. PAYMENT_MODE: sandbox или disabled.')
if not DEV_MODE and PUBLIC_BASE_URL.startswith('http://'):
    # Local inspection still works, but Telegram Mini Apps require an HTTPS origin.
    pass
