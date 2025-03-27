import { defineEventHandler, createError } from 'h3';
import { getServerSession } from '#auth';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default defineEventHandler(async (event) => {
  // ✅ 1. Ensure the user is authenticated using Nuxt Auth
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  // ✅ 2. Check if user owns the game (Replace with real database check)
  const userHasGame = session.user.hasGame; // Mock field (set this in auth logic)
  if (!userHasGame) {
    throw createError({ statusCode: 403, message: 'You do not own this game' });
  }

  // ✅ 3. Setup AWS S3 Client (v3)
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const fileKey = 'games/game.zip'; // Path to game file in S3 bucket
  const expiresIn = 60 * 5; // Link expires in 5 minutes

  try {
    // ✅ Generate a pre-signed S3 URL using AWS SDK v3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });

    return { success: true, url };
  } catch (err) {
    throw createError({ statusCode: 500, message: 'Failed to generate download link' });
  }
});
