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

// Function to import the fixed HOA4 codes
async function importFixedHOA4Codes() {
  const filePath = path.join(__dirname, 'codestxtdd', 'HOA4-1-fixed.txt');
  console.log(`Processing ${filePath}`);
  
  try {
    // Get the game set ID for HOA4
    const gameSetResult = await pool.query(
      "SELECT id FROM game_sets WHERE name = 'Hidden Object Adventures 4'"
    );
    
    if (gameSetResult.rows.length === 0) {
      throw new Error('HOA4 game set not found');
    }
    
    const gameSetId = gameSetResult.rows[0].id;
    console.log(`Found game set ID for HOA4: ${gameSetId}`);
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into lines and filter out empty lines
    const codes = content.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.replace(/,$/g, '')); // Remove trailing commas
    
    console.log(`Found ${codes.length} codes to import`);
    
    // Insert codes into database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const code of codes) {
        try {
          await client.query(
            'INSERT INTO game_codes (code, game_set_id) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
            [code, gameSetId]
          );
          successCount++;
        } catch (err) {
          console.error(`Error inserting code ${code}:`, err.message);
          errorCount++;
        }
      }
      
      await client.query('COMMIT');
      console.log(`Successfully imported ${successCount} codes for HOA4`);
      if (errorCount > 0) {
        console.log(`Failed to import ${errorCount} codes`);
      }
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Error importing HOA4 codes:`, err);
  } finally {
    await pool.end();
  }
}

// Run the import
importFixedHOA4Codes();
