-- Database schema for Digital Download Frontend

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game sets table
CREATE TABLE IF NOT EXISTS game_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_set_id UUID NOT NULL REFERENCES game_sets(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  download_url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Game codes table
CREATE TABLE IF NOT EXISTS game_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_set_id UUID NOT NULL REFERENCES game_sets(id),
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add test serial number
INSERT INTO game_sets (id, name, description)
VALUES 
  ('1d2b5ea1-afa5-4243-aab1-cc68805a8af7', 'Hidden Object Adventures 3', 'Collection of hidden object adventure games')
ON CONFLICT (id) DO NOTHING;

-- Add test serial number
INSERT INTO game_codes (game_set_id, serial_number)
VALUES 
  ('7e77eda7-7caa-4904-b048-218b0cae8e6b', 'TEST123456')
ON CONFLICT (serial_number) DO NOTHING;

-- Insert sample games
INSERT INTO games (game_set_id, name, description, download_url, image_url)
VALUES
  ('7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Frankenstein The Village', 'Adventure in a haunted village.', 's3://ddfiles1234/HOA3/Frankenstein_The_Village_Setup.exe', 's3://ddfiles1234/HOA3/images/Frankenstein.jpg'),
  ('7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Medford Asylum Paranormal Case', 'Solve mysteries in an asylum.', 's3://ddfiles1234/HOA3/Medford_Asylum_Paranormal_Case_Setup.exe', 's3://ddfiles1234/HOA3/images/Medford_Asylum.jpg'),
  ('7e77eda7-7caa-4904-b048-218b0cae8e6b', 'Nostradamus The Four Horsemen', 'Unravel Nostradamus predictions.', 's3://ddfiles1234/HOA3/Nostradamus_The_Four_Horsemen_Setup.exe', 's3://ddfiles1234/HOA3/images/Nostradamus.jpg')
ON CONFLICT DO NOTHING;
