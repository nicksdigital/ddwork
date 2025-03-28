-- Insert a sample game set and games for testing
INSERT INTO game_sets (id, name, description)
VALUES 
  ('7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Hidden Object Adventures 3', 'Collection of hidden object adventure games');

-- Insert sample games
INSERT INTO games (id, game_set_id, name, description, download_url, image_url)
VALUES
  (gen_random_uuid(), '7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Frankenstein The Village', 'Adventure in a haunted village.', 's3://ddfiles1234/HOA3/Frankenstein_The_Village_Setup.exe', 's3://ddfiles1234/HOA3/images/Frankenstein.jpg'),
  (gen_random_uuid(), '7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Medford Asylum Paranormal Case', 'Solve mysteries in an asylum.', 's3://ddfiles1234/HOA3/Medford_Asylum_Paranormal_Case_Setup.exe', 's3://ddfiles1234/HOA3/images/Medford_Asylum.jpg'),
  (gen_random_uuid(), '7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Nostradamus The Four Horsemen', 'Unravel Nostradamus predictions.', 's3://ddfiles1234/HOA3/Nostradamus_The_Four_Horsemen_Setup.exe', 's3://ddfiles1234/HOA3/images/Nostradamus.jpg');
