-- One row per client network. IPv4 is stored as-is; IPv6 is collapsed to its /64
-- prefix, because a single IPv6 user usually controls an entire /64.
CREATE TABLE ip_limits (
	ip_key TEXT PRIMARY KEY,
	last_play_at INTEGER NOT NULL,
	plays INTEGER NOT NULL DEFAULT 1
);

-- Audit log of every play.
CREATE TABLE plays (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ip_key TEXT NOT NULL,
	ip TEXT NOT NULL,
	country TEXT,
	won INTEGER NOT NULL,
	created_at INTEGER NOT NULL
);

-- A win reserves one pass. The reservation holds for 5 minutes; if no email is
-- submitted by then, the pass goes back into the pool.
CREATE TABLE claims (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	token_hash TEXT NOT NULL UNIQUE,
	ip_key TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL,
	email TEXT UNIQUE,
	redeemed_at INTEGER,
	message_id TEXT
);

CREATE INDEX claims_active ON claims (redeemed_at, expires_at);
