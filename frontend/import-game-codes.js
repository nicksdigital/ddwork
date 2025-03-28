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

// Directory containing game code files
const codesDir = path.join(__dirname, 'codestxtdd');

// Function to extract game type from filename
function getGameTypeFromFilename(filename) {
  // Extract the prefix (e.g., "HOA3" from "HOA3-1.txt")
  const prefix = filename.split('-')[0];
  return prefix;
}

// Function to process a single file
async function processFile(filePath, gameType) {
  console.log(`Processing ${filePath} (Game Type: ${gameType})`);
  
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
          'INSERT INTO game_codes (code, game_type) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
          [code, gameType]
        );
      }
      
      await client.query('COMMIT');
      console.log(`Successfully imported ${codes.length} codes for ${gameType}`);
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
async function importAllCodes() {
  try {
    // Get all text files in the codes directory
    const files = fs.readdirSync(codesDir)
      .filter(file => file.endsWith('.txt'));
    
    console.log(`Found ${files.length} code files to process`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(codesDir, file);
      const gameType = getGameTypeFromFilename(file);
      await processFile(filePath, gameType);
    }
    
    console.log('All game codes imported successfully!');
  } catch (err) {
    console.error('Error importing game codes:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the import
importAllCodes();
