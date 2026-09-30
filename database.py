import sqlite3
import secrets
import time
from contextlib import contextmanager

import config

SCALE = 10 ** 8  # all money is stored as integers (1e-8 units)

SCHEMA = """
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, first_name TEXT, photo TEXT,
  blocked INTEGER NOT NULL DEFAULT 0, created INTEGER);
CREATE TABLE IF NOT EXISTS admins(user_id INTEGER PRIMARY KEY, granted_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS workers(user_id INTEGER PRIMARY KEY, granted_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS balances(user_id INTEGER, currency TEXT,
  amount INTEGER NOT NULL DEFAULT 0 CHECK(amount>=0), PRIMARY KEY(user_id,currency));
CREATE TABLE IF NOT EXISTS deals(id TEXT PRIMARY KEY, creator_id INTEGER, seller_id INTEGER, buyer_id INTEGER,
  amount INTEGER, currency TEXT, description TEXT, nft TEXT, status TEXT, created INTEGER, updated INTEGER,
  join_code TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS join_attempts(user_id INTEGER PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS txs(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, type TEXT, currency TEXT,
  amount INTEGER, status TEXT, details TEXT, ref TEXT, created INTEGER);
CREATE TABLE IF NOT EXISTS requisites(user_id INTEGER, kind TEXT, value TEXT, PRIMARY KEY(user_id,kind));
CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY AUTOINCREMENT, deal_id TEXT, author_id INTEGER,
  target_id INTEGER, rating INTEGER, text TEXT, created INTEGER, UNIQUE(deal_id,author_id));
CREATE TABLE IF NOT EXISTS site_reviews(author_id INTEGER PRIMARY KEY, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  text TEXT, created INTEGER NOT NULL, updated INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS worker_reviews(id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  text TEXT NOT NULL, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS work_reviews(author_id INTEGER PRIMARY KEY,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), text TEXT NOT NULL,
  created INTEGER NOT NULL, updated INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_worker_reviews_worker ON worker_reviews(worker_id,id);
CREATE TABLE IF NOT EXISTS promo_claims(user_id INTEGER NOT NULL, code TEXT NOT NULL, created INTEGER NOT NULL,
  PRIMARY KEY(user_id,code));
CREATE TABLE IF NOT EXISTS deal_events(id INTEGER PRIMARY KEY AUTOINCREMENT,
 deal_id TEXT NOT NULL, status TEXT NOT NULL, created INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ix_events_deal ON deal_events(deal_id,id);
CREATE TRIGGER IF NOT EXISTS deal_created AFTER INSERT ON deals BEGIN
 INSERT INTO deal_events(deal_id,status,created) VALUES(NEW.id,NEW.status,NEW.created);
END;
CREATE TRIGGER IF NOT EXISTS deal_status_changed AFTER UPDATE OF status ON deals
 WHEN OLD.status != NEW.status BEGIN
 INSERT INTO deal_events(deal_id,status,created) VALUES(NEW.id,NEW.status,NEW.updated);
END;
CREATE INDEX IF NOT EXISTS ix_deals_seller ON deals(seller_id);
CREATE INDEX IF NOT EXISTS ix_deals_buyer ON deals(buyer_id);
CREATE INDEX IF NOT EXISTS ix_txs_user ON txs(user_id);
CREATE INDEX IF NOT EXISTS ix_rev_target ON reviews(target_id);
"""


def conn():
    c = sqlite3.connect(config.DB_PATH, timeout=15, isolation_level=None)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA journal_mode=WAL")
    return c


def init():
    c = conn()
    try:
        c.executescript(SCHEMA)
        c.execute("BEGIN IMMEDIATE")
        if not any(col[1] == "join_code" for col in c.execute("PRAGMA table_info(deals)")):
            c.execute("ALTER TABLE deals ADD COLUMN join_code TEXT")
        c.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_deals_join_code ON deals(join_code)")
        for (did,) in c.execute("SELECT id FROM deals WHERE join_code IS NULL"):
            c.execute("UPDATE deals SET join_code=? WHERE id=?", (new_join_code(c), did))
        c.execute("COMMIT")
    except BaseException:
        if c.in_transaction:
            c.execute("ROLLBACK")
        raise
    finally:
        c.close()


def new_join_code(c):
    """Draw a unique six-digit code while holding a write transaction."""
    for _ in range(100):
        code = str(secrets.randbelow(900000) + 100000)
        if not c.execute("SELECT 1 FROM deals WHERE join_code=?", (code,)).fetchone():
            return code
    raise RuntimeError("Не удалось создать код сделки")


@contextmanager
def tx():
    """Atomic write transaction (BEGIN IMMEDIATE serialises all money operations)."""
    c = conn()
    try:
        c.execute("BEGIN IMMEDIATE")
        yield c
        c.execute("COMMIT")
    except BaseException:
        try:
            c.execute("ROLLBACK")
        except sqlite3.Error:
            pass
        raise
    finally:
        c.close()


def rows(sql, args=()):
    c = conn()
    try:
        return [dict(r) for r in c.execute(sql, args).fetchall()]
    finally:
        c.close()


def row(sql, args=()):
    r = rows(sql, args)
    return r[0] if r else None


def is_admin(uid):
    return row("SELECT 1 FROM admins WHERE user_id=?", (uid,)) is not None


def grant_admin(uid):
    with tx() as c:
        c.execute("INSERT OR IGNORE INTO admins(user_id,granted_at) VALUES(?,?)", (uid, int(time.time())))


def is_worker(uid):
    return row("SELECT 1 FROM workers WHERE user_id=?", (uid,)) is not None


def grant_worker(uid):
    with tx() as c:
        c.execute("INSERT OR IGNORE INTO workers(user_id,granted_at) VALUES(?,?)", (uid, int(time.time())))


def upsert_user(tg):
    photo = tg.get("photo_url")
    if not isinstance(photo, str) or not photo.startswith("https://"):
        photo = None
    with tx() as c:
        c.execute(
            "INSERT INTO users(id,username,first_name,photo,created) VALUES(?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET username=excluded.username, first_name=excluded.first_name, photo=excluded.photo",
            (int(tg["id"]), (tg.get("username") or None), str(tg.get("first_name") or "")[:64], photo, int(time.time())),
        )
        return dict(c.execute("SELECT * FROM users WHERE id=?", (int(tg["id"]),)).fetchone())


def move(c, uid, cur, delta):
    """Atomically change balance; raises ValueError if it would go negative."""
    c.execute("INSERT OR IGNORE INTO balances(user_id,currency,amount) VALUES(?,?,0)", (uid, cur))
    r = c.execute(
        "UPDATE balances SET amount=amount+? WHERE user_id=? AND currency=? AND amount+?>=0 AND amount+?<=?",
        (delta, uid, cur, delta, delta, config.MAX_AMOUNT * SCALE),
    )
    if r.rowcount != 1:
        raise ValueError("Недостаточно средств или превышен лимит баланса")


def log(c, uid, typ, cur, amount, status="done", details="", ref=""):
    c.execute(
        "INSERT INTO txs(user_id,type,currency,amount,status,details,ref,created) VALUES(?,?,?,?,?,?,?,?)",
        (uid, typ, cur, amount, status, details, ref, int(time.time())),
    )
