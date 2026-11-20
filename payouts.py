"""Recipient validation for withdrawal requests. No payout amount floors.

This stores requests, not real payment instructions: the project has no payment
provider. Card PANs are validated in memory; only their last four digits persist.
"""
import base64
import binascii
import hashlib
import json
from pathlib import Path
import re

import database as db

BANKS = json.loads((Path(__file__).parent / 'static/banks.json').read_text())
BANK_BY_ID = {b['id']: b for b in BANKS}
FIAT = ('RUB', 'UAH', 'KZT', 'UZS')


class InvalidRecipient(ValueError):
    pass


def base58check(value):
    alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    try:
        n = 0
        for ch in value:
            n = n * 58 + alphabet.index(ch)
        raw = b'\0' * (len(value) - len(value.lstrip('1'))) + n.to_bytes((n.bit_length() + 7) // 8, 'big')
        return raw[:-4] if len(raw) >= 5 and hashlib.sha256(hashlib.sha256(raw[:-4]).digest()).digest()[:4] == raw[-4:] else None
    except ValueError:
        return None


def bitcoin_address(value):
    if value.startswith(('1', '3')):
        raw = base58check(value)
        return raw is not None and len(raw) == 21 and raw[0] in (0, 5)
    if value.lower() != value and value.upper() != value:
        return False
    value = value.lower()
    if not value.startswith('bc1') or not 14 <= len(value) <= 90:
        return False
    alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
    try:
        data = [alphabet.index(ch) for ch in value[3:]]
    except ValueError:
        return False
    check = 1
    for n in [3, 3, 0, 2, 3] + data:  # HRP expansion for "bc"
        top = check >> 25
        check = ((check & 0x1ffffff) << 5) ^ n
        for i, generator in enumerate((0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3)):
            if (top >> i) & 1:
                check ^= generator
    version = data[0]
    if version > 16 or check != (1 if version == 0 else 0x2bc830a3):
        return False
    bits = (len(data) - 7) * 5
    size = bits // 8
    padding = bits % 8
    return (2 <= size <= 40 and (version != 0 or size in (20, 32))
            and padding < 5 and (not padding or not (data[-7] & ((1 << padding) - 1))))


def ton_address(value):
    if re.fullmatch(r'0:[a-fA-F0-9]{64}', value):
        return True
    if not re.fullmatch(r'[A-Za-z0-9_-]{48}', value):
        return False
    try:
        raw = base64.urlsafe_b64decode(value)
        return (len(raw) == 36 and raw[0] in (0x11, 0x51) and raw[1] == 0
                and binascii.crc_hqx(raw[:34], 0).to_bytes(2, 'big') == raw[34:])
    except (ValueError, binascii.Error):
        return False


def recipient(data, currency, luhn):
    method = data.get('method')
    if method == 'stars':
        username = str(data.get('username', '')).strip().lstrip('@')
        if currency != 'STARS' or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_]{4,31}', username):
            raise InvalidRecipient('Проверьте Telegram-юзернейм получателя')
        return '', {'username': '@' + username}
    if method == 'bank':
        bank_id = data.get('bank_id')
        bank = BANK_BY_ID.get(bank_id) if isinstance(bank_id, str) else None
        if not bank or currency != bank['currency']:
            raise InvalidRecipient('Выберите банк и соответствующую валюту')
        phone = re.sub(r'[\s()+-]', '', str(data.get('phone', '')))
        patterns = {'RUB': r'7\d{10}', 'UAH': r'380\d{9}', 'KZT': r'7\d{10}', 'UZS': r'998\d{9}'}
        if not re.fullmatch(patterns[currency], phone):
            raise InvalidRecipient('Проверьте номер телефона и код страны')
        pan = re.sub(r'[ -]', '', str(data.get('card', '')))
        if not re.fullmatch(r'\d{12,19}', pan) or not luhn(pan):
            raise InvalidRecipient('Проверьте номер банковской карты')
        return '', {'bank_id': bank['id'], 'bank': bank['name']['en'], 'phone': '+' + phone, 'card_last4': pan[-4:]}
    if method == 'wallet':
        address = str(data.get('address', '')).strip()
        network = str(data.get('network', ''))
        valid = False
        if currency == 'TON' and network == 'TON':
            valid = ton_address(address)
        elif currency == 'BTC' and network == 'Bitcoin':
            valid = bitcoin_address(address)
        elif currency == 'USDT':
            if network == 'TRC20':
                raw = base58check(address) if len(address) == 34 else None
                valid = raw is not None and len(raw) == 21 and raw[0] == 0x41
            elif network == 'ERC20':
                valid = re.fullmatch(r'0x[a-fA-F0-9]{40}', address) is not None
            elif network == 'TON':
                valid = ton_address(address)
        if not valid:
            raise InvalidRecipient('Проверьте адрес кошелька и выбранную сеть')
        return network, {'address': address}
    raise InvalidRecipient('Выберите способ вывода')


def submit(uid, data, amt, currency, luhn):
    if amt is None or currency not in (*FIAT, 'TON', 'USDT', 'STARS', 'BTC'):
        raise InvalidRecipient('Проверьте сумму и валюту')
    if currency in FIAT and amt % (db.SCALE // 100):
        raise InvalidRecipient('Для этой валюты доступны два знака после запятой')
    if currency == 'STARS' and amt % db.SCALE:
        raise InvalidRecipient('Укажите целое количество Stars')
    network, details = recipient(data, currency, luhn)
    key = data.get('request_key', '')
    if not isinstance(key, str) or not re.fullmatch(r'[A-Za-z0-9_-]{16,80}', key):
        raise InvalidRecipient('Обновите страницу и повторите заявку')
    method = data['method']
    safe = json.dumps({'method': method, 'currency': currency, 'network': network, **details}, ensure_ascii=False, sort_keys=True)
    fingerprint = hashlib.sha256((str(amt) + safe).encode()).hexdigest()
    with db.tx() as c:
        old = c.execute('SELECT p.tx_id,p.fingerprint,t.status FROM payout_requests p '
                        'JOIN txs t ON t.id=p.tx_id WHERE p.user_id=? AND p.request_key=?', (uid, key)).fetchone()
        if old:
            if old['fingerprint'] != fingerprint:
                raise InvalidRecipient('Эта заявка уже отправлена с другими реквизитами')
            return {'id': old['tx_id'], 'status': old['status']}
        db.move(c, uid, currency, -amt)
        db.log(c, uid, 'withdraw', currency, amt, 'pending', safe)
        tid = c.execute('SELECT last_insert_rowid()').fetchone()[0]
        c.execute('INSERT INTO payout_requests VALUES(?,?,?,?)', (uid, key, tid, fingerprint))
        c.execute('INSERT INTO payout_recipients VALUES(?,?,?,?,?) ON CONFLICT(user_id,method,currency,network) DO UPDATE SET details=excluded.details',
                  (uid, method, currency, network, json.dumps(details, ensure_ascii=False)))
        return {'id': tid, 'status': 'pending'}
