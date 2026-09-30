"""Run a local, explicitly labelled sandbox; no real payments or Telegram tokens."""
import os
os.environ['DEV_MODE'] = '1'
os.environ['PAYMENT_MODE'] = 'sandbox'
os.environ.setdefault('HOST', '127.0.0.1')
os.environ.setdefault('PORT', '8000')
os.environ.setdefault('PUBLIC_BASE_URL', 'http://127.0.0.1:8000')
from main import app
import config

if __name__ == '__main__':
    print('ТЕСТОВЫЙ РЕЖИМ. Деньги не списываются.')
    print('Продавец: http://127.0.0.1:8000/?dev=1')
    print('Покупатель: http://127.0.0.1:8000/?dev=2')
    app.run(host=config.HOST, port=config.PORT, debug=False, threaded=True)
