-- Powers the "pulls in the last 24h" counter on the page.
CREATE INDEX plays_created_at ON plays (created_at);
