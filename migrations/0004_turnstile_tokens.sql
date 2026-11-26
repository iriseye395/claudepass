-- Cloudflare Turnstile token replay detection is eventually consistent, so the
-- same token can be validated more than once (including from a different
-- network). Store the SHA-256 of every accepted token and rely on the primary
-- key to make single-use a local invariant.
CREATE TABLE turnstile_tokens (
	token_hash TEXT PRIMARY KEY,
	created_at INTEGER NOT NULL
);

CREATE INDEX turnstile_tokens_created_at ON turnstile_tokens (created_at);
