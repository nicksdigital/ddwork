import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://nick@localhost:5432/digital_download'
});

// Game set definitions
const gameSets = [
  {
    code: 'HOA3',
    name: 'Hidden Object Adventures 3',
    description: 'Collection of hidden object adventure games including Frankenstein The Village, Medford Asylum, and more.'
  },
  {
    code: 'HOA4',
    name: 'Hidden Object Adventures 4',
    description: 'The latest collection of hidden object adventure games.'
  },
  {
    code: 'HOM4',
    name: 'Hidden Object Mysteries 4',
    description: 'Collection of mystery-themed hidden object games.'
  }
];

// Directory containing game code files
const codesDir = path.join(__dirname, 'codestxtdd');

// Function to extract game set code from filename
function getGameSetFromFilename(filename) {
  // Extract the prefix (e.g., "HOA3" from "HOA3-1.txt")
  return filename.split('-')[0];
}

// Function to create game sets
async function createGameSets() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const gameSetIds = {};
    
    for (const gameSet of gameSets) {
      const result = await client.query(
        'INSERT INTO game_sets (name, description) VALUES ($1, $2) RETURNING id',
        [gameSet.name, gameSet.description]
      );
      
      const gameSetId = result.rows[0].id;
      gameSetIds[gameSet.code] = gameSetId;
      console.log(`Created game set: ${gameSet.name} with ID: ${gameSetId}`);
    }
    
    await client.query('COMMIT');
    return gameSetIds;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Function to process a single file
async function processFile(filePath, gameSetId) {
  console.log(`Processing ${filePath} (Game Set ID: ${gameSetId})`);
  
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into lines and filter out empty lines
    const codes = content.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.replace(/,$/g, '')); // Remove trailing commas
    
    // Insert codes into database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const code of codes) {
        await client.query(
          'INSERT INTO game_codes (code, game_set_id) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
          [code, gameSetId]
        );
      }
      
      await client.query('COMMIT');
      console.log(`Successfully imported ${codes.length} codes for game set ID: ${gameSetId}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Main function to process all files
async function importAllData() {
  try {
    // Create game sets and get their IDs
    const gameSetIds = await createGameSets();
    
    // Get all text files in the codes directory
    const files = fs.readdirSync(codesDir)
      .filter(file => file.endsWith('.txt'));
    
    console.log(`Found ${files.length} code files to process`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(codesDir, file);
      const gameSetCode = getGameSetFromFilename(file);
      const gameSetId = gameSetIds[gameSetCode];
      
      if (gameSetId) {
        await processFile(filePath, gameSetId);
      } else {
        console.error(`No game set found for code: ${gameSetCode}`);
      }
    }
    
    console.log('All game codes imported successfully!');
  } catch (err) {
    console.error('Error importing game data:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the import
importAllData();
