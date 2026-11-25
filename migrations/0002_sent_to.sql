-- The address exactly as the winner typed it (claims.email holds the canonical form used for uniqueness).
ALTER TABLE claims ADD COLUMN sent_to TEXT;
