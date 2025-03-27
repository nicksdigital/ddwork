import fs from 'fs';
import path from 'path';

// Get all `.txt` files in the current directory
const directoryPath = path.resolve(__dirname)
const txtFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.txt'));

if (txtFiles.length === 0) {
    console.log('❌ No .txt files found in the current directory.');
    process.exit(1);
}

console.log(`📂 Found ${txtFiles.length} .txt file(s). Processing...`);

// @ts-ignore
txtFiles.forEach(file => {
    const inputFilePath = path.join(directoryPath, file);
    const outputFilePath = path.join(directoryPath, `formatted_${file}.csv`);

    try {
        // Read file content
        const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

        // Process serial numbers: trim whitespace, remove empty lines & duplicates
        const serials = fileContent
            .split('\n')
            .map(serial => formatSerial(serial, '7e77eda7-7caa-4904-b048-218b0cae8e6b')
            ) // Trim whitespace
            .filter(serial => serial.length > 0) // Remove empty lines
            .filter((serial, index, self) => self.indexOf(serial) === index); // Remove duplicates

        // Write formatted serials to a new file
        fs.writeFileSync(outputFilePath, serials.join('\n'), 'utf-8');

        console.log(`✅ Formatted file saved: ${outputFilePath}`);
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
    }
});

function formatSerial(serial: string, gamnesetid:string):string {
    serial = serial.trim();

   let s = `"${serial}","${gamnesetid}"`;

    return s;

}

console.log('🎉 All files processed!');
