import { defineEventHandler, createError, getQuery } from 'h3';
import { sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  // In a development environment, redirect to a placeholder image
  // This avoids 404 errors for mock S3 image URLs
  
  // You could alternatively serve different placeholder images based on the path
  // For now, we'll just use a single placeholder for all mock images
  
  return sendRedirect(event, '/placeholder-game.png', 302);
});
