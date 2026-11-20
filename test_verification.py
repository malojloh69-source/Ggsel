"""Virtual verification state, API enforcement, approvals and notification checks."""
import secrets
import time
import unittest
from unittest.mock import patch

import test_app
import bot
import config
import database as db
import verification


class VerificationTests(unittest.TestCase):
    setUp = test_app.DealTests.setUp
    req = test_app.DealTests.req

    def seed(self, currency='RUB', units=1000 * db.SCALE, status='completed', uid=2):
        self.req('/api/me', uid)
        with db.tx() as c:
            did = secrets.token_hex(12).upper()
            c.execute('INSERT INTO deals VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', (
                did, 1, 1, uid, units, currency, 'Virtual test deal', '[]', status,
                int(time.time()), int(time.time()), db.new_join_code(c)))
        return did

    def test_two_step_lifecycle_approval_and_small_withdrawal(self):
        self.assertEqual(self.req('/api/me', 2).json['verification']['stage'], 'none')
        self.req('/api/sandbox/fund', 2, 'POST', {'amount': '3000', 'currency': 'RUB'})
        self.req('/api/sandbox/fund', 2, 'POST', {'amount': '10', 'currency': 'STARS'})
        payload = dict(method='stars', currency='STARS', amount='1', username='@recipient', request_key='v' * 32)
        for index in range(2):
            deal = self.req('/api/deals', 1, 'POST', {
                'role': 'seller', 'amount': '1000', 'currency': 'RUB', 'description': 'Virtual item',
            }).json
            self.assertEqual(self.req('/api/deals/join', 2, 'POST', {'code': deal['join_code']}).status_code, 200)
            self.assertEqual(self.req(f"/api/deals/{deal['id']}/pay", 2, 'POST').status_code, 200)
            self.assertEqual(self.req(f"/api/deals/{deal['id']}/confirm", 2, 'POST').status_code, 200)
            state = self.req('/api/verification', 2).json
            self.assertEqual(state['qualified_deals'], index + 1)
            self.assertEqual(state['stage'], ['deals', 'support'][index])
            self.assertEqual(self.req('/api/txs/withdraw', 2, 'POST', payload).status_code, 403)
        before = db.rows('SELECT * FROM balances')
        for path, method, data in [('/api/home', 'GET', None), ('/api/deals', 'GET', None),
                                   ('/api/worker/activate', 'POST', {}),
                                   ('/api/txs/deposit', 'POST', {'amount': '1', 'currency': 'RUB'}),
                                   ('/api/sandbox/fund', 'POST', {'amount': '1', 'currency': 'RUB'})]:
            response = self.req(path, 2, method, data)
            self.assertEqual(response.status_code, 403, (path, response.json))
            self.assertTrue(response.json['verification']['locked'])
        self.assertEqual(db.rows('SELECT * FROM balances'), before)
        self.assertEqual(db.rows("SELECT * FROM txs WHERE type='withdraw'"), [])
        self.assertTrue(self.req('/api/me', 2).json['verification']['locked'])
        self.assertEqual(self.req('/api/admin/users/2/verify', 1, 'POST').status_code, 200)
        self.assertEqual(db.rows('SELECT * FROM balances'), before)
        first = self.req('/api/txs/withdraw', 2, 'POST', payload)
        self.assertEqual(first.status_code, 200, first.json)
        self.assertEqual(self.req('/api/txs/withdraw', 2, 'POST', payload).json, first.json)
        self.assertEqual(self.req('/api/me', 2).json['balances']['STARS'], '9')
        self.assertEqual(self.req('/api/home', 2).status_code, 200)

    def test_each_deal_must_meet_threshold_not_just_the_sum(self):
        self.seed(units=600 * db.SCALE)
        self.seed(units=600 * db.SCALE)
        state = self.req('/api/verification', 2).json
        self.assertEqual(state['qualified_deals'], 0)
        self.assertEqual(state['stage'], 'deals')
        self.seed(status='cancelled')
        self.seed(status='paid')
        self.assertEqual(verification.status(2)['qualified_deals'], 0)
        self.seed()
        self.assertEqual(verification.status(2)['qualified_deals'], 1)

    def test_all_virtual_currency_thresholds_are_inclusive_and_exact(self):
        expected = {'RUB': 100000000000, 'UAH': 55173000000, 'KZT': 542129000000,
                    'UZS': 14612214000000, 'TON': 1194530000, 'USDT': 1221860000,
                    'STARS': 93900000000, 'BTC': 19716}
        for currency, minimum in expected.items():
            with self.subTest(currency=currency):
                self.setUp()
                self.seed(currency, minimum - 1)
                self.seed(currency, minimum)
                self.assertEqual(verification.status(2)['qualified_deals'], 1)
                self.assertFalse(verification.status(2)['locked'])
                self.seed(currency, minimum)
                self.assertEqual(verification.status(2)['qualified_deals'], 2)
                self.assertTrue(verification.status(2)['locked'])

    def test_staff_and_disabled_mode_are_exempt_and_stats_do_not_count(self):
        self.req('/api/me', 2)
        db.grant_worker(2)
        self.req('/api/worker/stats', 2, 'POST', {'completed': 100, 'rating': '5'})
        self.assertEqual(verification.status(2)['qualified_deals'], 0)
        self.seed()
        self.seed()
        self.assertEqual(verification.status(1)['stage'], 'exempt')
        self.assertEqual(verification.status(2)['stage'], 'exempt')
        self.assertEqual(self.req('/api/worker', 2).status_code, 200)
        self.seed(uid=3)
        self.seed(uid=3)
        self.assertTrue(verification.status(3)['locked'])
        with patch.object(config, 'PAYMENT_MODE', 'disabled'):
            self.assertEqual(verification.status(3)['stage'], 'disabled')
            self.assertEqual(self.req('/api/home', 3).status_code, 200)
            self.assertEqual(self.req('/api/admin/users/3/verify', 1, 'POST').status_code, 403)
            self.assertEqual(self.req('/api/txs/withdraw', 3, 'POST', {}).status_code, 503)

    def test_approval_is_admin_only_idempotent_and_persistent(self):
        self.seed()
        self.assertEqual(self.req('/api/admin/users/2/verify', 1, 'POST').status_code, 409)
        self.seed()
        self.assertEqual(self.req('/api/admin/users/2/verify', 3, 'POST').status_code, 403)
        self.assertEqual(self.req('/api/admin/users/999/verify', 1, 'POST').status_code, 404)
        first = self.req('/api/admin/users/2/verify', 1, 'POST')
        second = self.req('/api/admin/users/2/verify', 1, 'POST')
        self.assertEqual(first.json, second.json)
        self.assertEqual(db.row('SELECT COUNT(*) n FROM verification_approvals')['n'], 1)
        db.init()
        self.assertEqual(self.req('/api/me', 2).json['verification']['stage'], 'verified')
        self.req('/api/admin/users/2/block', 1, 'POST', {'blocked': True})
        self.req('/api/admin/users/2/verify', 1, 'POST')
        self.assertEqual(self.req('/api/me', 2).status_code, 403)
        self.assertTrue(db.row('SELECT blocked FROM users WHERE id=2')['blocked'])

    def test_first_success_notice_is_once_and_separate_from_lock_notice(self):
        # Every successful virtual deal starts verification, including one below the threshold.
        self.seed(units=125 * db.SCALE)
        with patch.object(config, 'BOT_TOKEN', 'test-token'), patch.object(bot, 'telegram') as send:
            verification.notify(2)
            verification.notify(2)
            self.assertEqual(send.call_count, 1)
            self.assertIn('Требуется верификация', send.call_args.args[1]['text'])
            self.assertIn('Демо', send.call_args.args[1]['text'])
            self.assertNotIn('Доступ временно ограничен', send.call_args.args[1]['text'])
            self.assertEqual(verification.status(2)['completed_deals'], 1)
            self.assertFalse(verification.status(2)['locked'])
            db.init()
            verification.notify(2)
            self.assertEqual(send.call_count, 1)
            self.seed()
            verification.notify(2)
            self.assertEqual(send.call_count, 1)
            self.seed()
            verification.notify(2)
            verification.notify(2)
            self.assertEqual(send.call_count, 2)
            self.assertIn('Доступ временно ограничен', send.call_args.args[1]['text'])
        self.assertEqual(db.row('SELECT COUNT(*) n FROM verification_first_notices')['n'], 1)
        self.assertEqual(db.row('SELECT COUNT(*) n FROM verification_notices')['n'], 1)

    def test_first_notice_failure_is_retryable_and_staff_are_exempt(self):
        self.seed()
        with patch.object(config, 'BOT_TOKEN', 'test-token'), patch.object(bot, 'telegram', side_effect=RuntimeError('offline')):
            with self.assertLogs('verification', level='ERROR'):
                verification.notify(2)
        self.assertEqual(db.rows('SELECT * FROM verification_first_notices'), [])
        with patch.object(config, 'BOT_TOKEN', 'test-token'), patch.object(bot, 'telegram') as send:
            verification.notify(2)
            self.assertEqual(send.call_count, 1)
            self.seed(uid=3)
            db.grant_worker(3)
            verification.notify(3)
            verification.notify(1)
            self.assertEqual(send.call_count, 1)

    def test_notices_are_demo_labelled_once_and_failed_delivery_can_retry(self):
        self.seed()
        self.seed()
        with patch.object(config, 'BOT_TOKEN', 'test-token'), patch.object(bot, 'telegram') as send:
            verification.notify(2)
            verification.notify(2)
            self.assertEqual(send.call_count, 1)
            self.assertIn('Демо', send.call_args.args[1]['text'])
            self.assertIn('не нужны', send.call_args.args[1]['text'])
        with db.tx() as c:
            c.execute('DELETE FROM verification_notices')
        with patch.object(config, 'BOT_TOKEN', 'test-token'), patch.object(bot, 'telegram', side_effect=RuntimeError('offline')):
            with self.assertLogs('verification', level='ERROR'):
                verification.notify(2)
        self.assertEqual(db.rows('SELECT * FROM verification_notices'), [])
        with patch.object(bot, 'telegram') as send:
            bot.handle({'message': {'chat': {'id': 2, 'type': 'private'},
                                   'from': {'id': 2}, 'text': '/newlevelAdmin'}})
            self.assertEqual(send.call_args.args[0], 'sendMessage')
            self.assertIn('Демо', send.call_args.args[1]['text'])
        self.assertFalse(db.is_admin(2))


if __name__ == '__main__':
    unittest.main()
