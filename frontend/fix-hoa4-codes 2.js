import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the HOA4 file
const inputFilePath = path.join(__dirname, 'codestxtdd', 'HOA4-1.txt');
const outputFilePath = path.join(__dirname, 'codestxtdd', 'HOA4-1-fixed.txt');

// Function to fix the HOA4 codes
function fixHOA4Codes() {
  try {
    // Read the file content
    const content = fs.readFileSync(inputFilePath, 'utf8');
    
    // The pattern for HOA4 codes appears to be: HA4X-XXXX-XXXXX
    // where X can be any character. Each code is 15 characters long.
    const codePattern = /HA4[A-Z]-[A-Z0-9]{4}-[A-Z0-9]{4}/g;
    
    // Extract all codes matching the pattern
    const matches = content.match(codePattern);
    
    if (!matches || matches.length === 0) {
      console.error('No valid HOA4 codes found in the file');
      return;
    }
    
    console.log(`Found ${matches.length} HOA4 codes`);
    
    // Format each code on a new line with a comma
    const formattedContent = matches.map(code => `${code},`).join('\n');
    
    // Write the formatted codes to a new file
    fs.writeFileSync(outputFilePath, formattedContent);
    
    console.log(`Successfully formatted ${matches.length} HOA4 codes and saved to ${outputFilePath}`);
  } catch (err) {
    console.error('Error fixing HOA4 codes:', err);
  }
}

// Run the function
fixHOA4Codes();
