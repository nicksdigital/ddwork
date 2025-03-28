import { defineEventHandler, createError, getCookie, getQuery } from 'h3';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { query } from '../utils/db';
import { verifyToken } from '../utils/auth';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Get game ID from query parameters
  const params = getQuery(event);
  const gameId = params.gameId;
  
  if (!gameId) {
    throw createError({ statusCode: 400, message: 'Game ID is required' });
  }

  console.log('Downloading game with ID:', gameId);

  // Get the auth token from cookies
  const token = getCookie(event, 'auth_token');
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
  
  // Verify the token and get the user ID
  const payload = verifyToken(token);
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }
  
  const userId = payload.userId;

  // Check if user owns the game
  const ownershipResult = await query(`
    SELECT 
      g.id, g.name, g.download_url
    FROM 
      games g
    JOIN 
      game_sets gs ON g.game_set_id = gs.id
    JOIN 
      game_codes gc ON gc.game_set_id = gs.id
    WHERE 
      g.id = $1 AND gc.used_by = $2
    LIMIT 1
  `, [gameId, userId]);

  if (ownershipResult.rows.length === 0) {
    throw createError({ statusCode: 403, message: 'You do not own this game' });
  }

  const game = ownershipResult.rows[0];
  const downloadUrl = game.download_url;
  
  // Extract S3 path from the download URL
  // Assuming the download_url is in the format: s3://bucket-name/path/to/file
  const s3UrlMatch = downloadUrl.match(/s3:\/\/([^\/]+)\/(.+)/);
  
  if (!s3UrlMatch) {
    throw createError({ statusCode: 500, message: 'Invalid download URL format' });
  }
  
  const bucket = s3UrlMatch[1];
  const fileKey = s3UrlMatch[2];

  // Check if AWS credentials are available
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || config.awsAccessKeyId;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || config.awsSecretAccessKey;
  const awsRegion = process.env.AWS_REGION || config.awsRegion || 'us-east-1';

  // For development environment without AWS credentials, return a mock download URL
  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.log('Using mock download URL (AWS credentials not available)');
    return { 
      success: true, 
      url: `/mock-download/${fileKey}?bucket=${bucket}`,
      game: {
        id: game.id,
        name: game.name
      },
      note: 'This is a mock download URL for development. In production, this would be a signed S3 URL.'
    };
  }

  console.log('Generating S3 signed URL with AWS credentials');

  // Setup AWS S3 Client
  const s3 = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const expiresIn = 60 * 5; // Link expires in 5 minutes

  try {
    // Generate a pre-signed S3 URL
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });

    return { 
      success: true, 
      url,
      game: {
        id: game.id,
        name: game.name
      }
    };
  } catch (err) {
    console.error('Error generating download link:', err);
    throw createError({ statusCode: 500, message: 'Failed to generate download link' });
  }
});
