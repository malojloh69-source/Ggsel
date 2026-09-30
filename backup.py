"""Consistent SQLite backup, including data still in the WAL journal."""
import sqlite3
from pathlib import Path
from datetime import datetime, timezone
import config

dest = Path(config.DB_PATH).parent / 'backups'
dest.mkdir(parents=True, exist_ok=True)
target = dest / ('deals-' + datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S') + '.sqlite3')
with sqlite3.connect(config.DB_PATH) as source, sqlite3.connect(target) as output:
    source.backup(output)
print(target)
