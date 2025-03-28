import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const imagesDir = path.join(__dirname, '../public/game-images');
const s3Dir = path.join(__dirname, '../s3-upload');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

if (!fs.existsSync(s3Dir)) {
  fs.mkdirSync(s3Dir, { recursive: true });
}

// Game titles and their image URLs
const games = [
  {
    title: 'Frankenstein The Village',
    imageUrl: 'https://cdn.mobygames.com/covers/8254057-frankenstein-the-village-windows-front-cover.jpg',
    s3Path: 's3://ddfiles1234/HOA3/images/Frankenstein.jpg'
  },
  {
    title: 'Medford Asylum Paranormal Case',
    imageUrl: 'https://cdn.mobygames.com/covers/4290584-medford-asylum-paranormal-case-iphone-front-cover.jpg',
    s3Path: 's3://ddfiles1234/HOA3/images/Medford_Asylum.jpg'
  },
  {
    title: 'Nostradamus The Four Horsemen',
    imageUrl: 'https://cdn.mobygames.com/covers/8254058-nostradamus-the-four-horsemen-of-the-apocalypse-windows-front-cover.jpg',
    s3Path: 's3://ddfiles1234/HOA3/images/Nostradamus.jpg'
  }
];

// Function to download an image
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
        resolve(filePath);
      });
      
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  const promises = games.map(game => {
    const fileName = path.basename(game.s3Path);
    const filePath = path.join(imagesDir, fileName);
    
    // Also create a copy in the s3-upload directory with the proper structure
    const s3FilePath = path.join(s3Dir, 'HOA3/images', fileName);
    const s3DirPath = path.dirname(s3FilePath);
    
    if (!fs.existsSync(s3DirPath)) {
      fs.mkdirSync(s3DirPath, { recursive: true });
    }
    
    return downloadImage(game.imageUrl, filePath)
      .then(() => {
        // Copy to S3 upload directory
        fs.copyFileSync(filePath, s3FilePath);
        console.log(`Copied to S3 upload directory: ${s3FilePath}`);
        
        return {
          title: game.title,
          localPath: filePath,
          s3Path: game.s3Path
        };
      });
  });
  
  try {
    const results = await Promise.all(promises);
    console.log('\nDownload Summary:');
    results.forEach(result => {
      console.log(`${result.title}: ${result.localPath} (S3: ${result.s3Path})`);
    });
    
    console.log('\nTo upload these images to S3, you can use the AWS CLI:');
    console.log('aws s3 cp s3-upload/ s3://ddfiles1234/ --recursive');
    
    // Update the database with the S3 paths
    console.log('\nThe images are already correctly referenced in your database.');
    console.log('You can verify with: psql -U nick -d digital_download -c "SELECT name, image_url FROM games LIMIT 10"');
    
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Run the download
downloadAllImages();
