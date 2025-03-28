-- Reset users table
TRUNCATE TABLE users CASCADE;

-- Ensure TEST123456 exists and is reset
INSERT INTO game_codes (code, game_set_id, used_by, used_at)
VALUES ('TEST123456', '1d2b5ea1-afa5-4243-aab1-cc68805a8af7', NULL, NULL)
ON CONFLICT (code) DO UPDATE
SET used_by = NULL, used_at = NULL, game_set_id = EXCLUDED.game_set_id;
