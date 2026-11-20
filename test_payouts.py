"""Withdrawal validation and reservation checks, using only a temporary database."""
import json
import secrets
import time
import unittest
from concurrent.futures import ThreadPoolExecutor

import test_app
from main import app
import database as db
import payouts


class PayoutTests(unittest.TestCase):
    setUp = test_app.DealTests.setUp
    req = test_app.DealTests.req

    def prepare(self):
        self.req('/api/me', 2)
        with db.tx() as c:
            for currency in ('RUB', 'UAH', 'KZT', 'UZS', 'TON', 'USDT', 'STARS', 'BTC'):
                db.move(c, 2, currency, 100 * db.SCALE)
            c.execute('INSERT INTO deals VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', (
                'ABCDEF0123456789ABCDEF01', 1, 1, 2, 125 * db.SCALE, 'RUB', 'Digital item', '[]',
                'completed', int(time.time()), int(time.time()), '102938'))

    def payload(self, **kwargs):
        return {**dict(method='stars', currency='STARS', amount='1', username='@recipient',
                       request_key=secrets.token_hex(16)), **kwargs}

    def submit(self, data):
        return self.req('/api/txs/withdraw', 2, 'POST', data)

    def test_every_bank_accepts_one_kopeck_equivalent(self):
        self.prepare()
        phones = {'RUB': '+70000000001', 'KZT': '+70000000001', 'UAH': '+380000000001', 'UZS': '+998000000001'}
        for bank in payouts.BANKS:
            with self.subTest(bank=bank['id']):
                response = self.submit(self.payload(method='bank', currency=bank['currency'], amount='0.01',
                                      bank_id=bank['id'], phone=phones[bank['currency']], card='4111111111111111'))
                self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(db.row("SELECT COUNT(*) n FROM txs WHERE type='withdraw'")['n'], 42)

    def test_no_minimum_for_stars_and_all_wallet_networks(self):
        self.prepare()
        self.assertEqual(self.submit(self.payload()).status_code, 200)
        cases = [('BTC', 'Bitcoin', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
                 ('TON', 'TON', '0:' + '1' * 64),
                 ('USDT', 'TON', '0:' + '2' * 64),
                 ('USDT', 'ERC20', '0x' + '3' * 40),
                 ('USDT', 'TRC20', 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb')]
        for currency, network, address in cases:
            with self.subTest(currency=currency, network=network):
                response = self.submit(self.payload(method='wallet', currency=currency,
                                                   amount='0.00000001', network=network, address=address))
                self.assertEqual(response.status_code, 200, response.json)

    def test_card_pan_never_persists(self):
        self.prepare()
        pan = '4111111111111111'
        response = self.submit(self.payload(method='bank', currency='RUB', amount='1', bank_id='sber',
                                           phone='+70000000001', card=pan))
        self.assertEqual(response.status_code, 200)
        stored = json.dumps(db.rows('SELECT * FROM payout_recipients') + db.rows('SELECT * FROM txs'))
        self.assertNotIn(pan, stored)
        self.assertIn('1111', stored)
        own = self.req('/api/payouts/recipients', 2).json
        self.assertEqual(own[0]['details']['card_last4'], '1111')
        self.assertEqual(self.req('/api/payouts/recipients', 3).json, [])
        db.init()
        self.assertEqual(self.req('/api/payouts/recipients', 2).json, own)

    def test_retries_are_atomic_and_idempotent(self):
        self.prepare()
        data = self.payload()
        def send(_):
            with app.test_client() as client:
                r = client.post('/api/txs/withdraw', json=data, headers={'X-Dev-User': '2'})
                return r.status_code, r.json
        with ThreadPoolExecutor(max_workers=6) as executor:
            results = list(executor.map(send, range(6)))
        self.assertTrue(all(code == 200 for code, _ in results), results)
        self.assertEqual(len({result['id'] for _, result in results}), 1)
        self.assertEqual(self.req('/api/me', 2).json['balances']['STARS'], '99')
        response = self.submit({**data, 'amount': '2'})
        self.assertEqual(response.status_code, 400)
        tid = results[0][1]['id']
        self.assertEqual(self.req(f'/api/admin/txs/{tid}/reject', 1, 'POST').status_code, 200)
        self.assertEqual(self.req(f'/api/admin/txs/{tid}/reject', 1, 'POST').status_code, 404)
        self.assertEqual(self.req('/api/me', 2).json['balances']['STARS'], '100')
        retried = self.submit(data)
        self.assertEqual(retried.json['status'], 'rejected')
        self.assertEqual(self.req('/api/me', 2).json['balances']['STARS'], '100')

    def test_invalid_amounts_do_not_reserve_balance(self):
        self.prepare()
        for amount in ('0', '-1', 'NaN', 'Infinity', '0.1', '1.000000001', '1000000001', '101'):
            with self.subTest(amount=amount):
                self.assertEqual(self.submit(self.payload(amount=amount)).status_code, 400)
        self.assertEqual(self.req('/api/me', 2).json['balances']['STARS'], '100')
        self.assertEqual(db.row('SELECT COUNT(*) n FROM payout_requests')['n'], 0)

    def test_invalid_recipient_network_and_shape(self):
        self.prepare()
        bad = [self.payload(username='@bad'), self.payload(method='bank', bank_id={}),
               self.payload(method='bank', currency='UAH', bank_id='sber'),
               self.payload(method='wallet', currency='BTC', network='TRC20', address='0:' + '1' * 64),
               self.payload(method='wallet', currency='BTC', network='Bitcoin', address='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb'),
               self.payload(method='wallet', currency='USDT', network='TRC20', address='T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwc'),
               self.payload(method='wallet', currency='TON', network='TON', address='EQ' + 'a' * 46),
               self.payload(method='wallet', currency='USDT', network='ERC20', address='0x1234'),
               self.payload(request_key='short')]
        for data in bad:
            with self.subTest(data=data):
                self.assertEqual(self.submit(data).status_code, 400)
        with app.test_client() as client:
            self.assertEqual(client.post('/api/txs/withdraw', json=[1], headers={'X-Dev-User': '2'}).status_code, 400)

    def test_public_assets_are_local_and_whitelisted(self):
        for bank in payouts.BANKS:
            with self.c.get('/static/' + bank['icon']) as response:
                self.assertEqual(response.status_code, 200)
        for asset in ('ton.png', 'btc.svg', 'usdt.svg'):
            with self.c.get('/static/assets/crypto/' + asset) as response:
                self.assertEqual(response.status_code, 200)
        for asset in ('purse', 'card', 'wallet', 'stars', 'ru', 'en', 'warning', 'success'):
            with self.c.get('/static/assets/animations/' + asset + '.webm') as response:
                self.assertEqual(response.status_code, 200)
        for path in ('/static/assets/crypto/main.py', '/static/assets/banks/../../main.py', '/static/assets/unknown/btc.svg'):
            self.assertEqual(self.c.get(path).status_code, 404)


if __name__ == '__main__':
    unittest.main()
