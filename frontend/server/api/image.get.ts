import { defineEventHandler, createError, getQuery } from 'h3';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Get image path from query parameters
  const params = getQuery(event);
  const imagePath = params.path;
  
  if (!imagePath) {
    throw createError({ statusCode: 400, message: 'Image path is required' });
  }

  console.log('Fetching image with path:', imagePath);

  // Check if the path is an S3 URL
  const s3UrlMatch = imagePath.toString().match(/s3:\/\/([^\/]+)\/(.+)/);
  
  if (!s3UrlMatch) {
    throw createError({ statusCode: 400, message: 'Invalid S3 image path format' });
  }
  
  const bucket = s3UrlMatch[1];
  const fileKey = s3UrlMatch[2];

  // Check if AWS credentials are available
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || config.awsAccessKeyId;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || config.awsSecretAccessKey;
  const awsRegion = process.env.AWS_REGION || config.awsRegion || 'us-east-1';

  // For development environment without AWS credentials, return a data URL for a colored placeholder
  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.log('Using mock image URL (AWS credentials not available)');
    
    // Extract game name from the file path to create a unique color
    const gameNameMatch = fileKey.match(/([^\/]+)\/images\/([^\/]+)\./);
    const gameName = gameNameMatch ? gameNameMatch[2] : 'Game';
    
    // Generate a simple SVG placeholder with the game name
    const color = getColorFromString(gameName);
    const svg = generatePlaceholderSVG(gameName, color);
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    
    return { 
      success: true, 
      url: dataUrl,
      note: 'This is a mock image for development. In production, this would be a signed S3 URL.'
    };
  }

  console.log('Generating S3 signed URL with AWS credentials for image');

  // Setup AWS S3 Client
  const s3 = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const expiresIn = 60 * 60; // Image URLs expire in 1 hour

  try {
    // Generate a pre-signed S3 URL
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });

    return { 
      success: true, 
      url
    };
  } catch (err) {
    console.error('Error generating image URL:', err);
    throw createError({ statusCode: 500, message: 'Failed to generate image URL' });
  }
});

// Helper function to generate a color from a string
function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

// Generate a simple SVG placeholder with the game name
function generatePlaceholderSVG(gameName: string, backgroundColor: string): string {
  // Truncate long game names
  const displayName = gameName.length > 15 ? gameName.substring(0, 12) + '...' : gameName;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${backgroundColor}" />
    <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white">${displayName}</text>
    <text x="200" y="180" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">Mock Game Image</text>
  </svg>`;
}
