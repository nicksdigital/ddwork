import { defineEventHandler, createError, getCookie } from 'h3';
import { query } from '../../utils/db';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
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

  try {
    // Get user's activated game sets & games
    const result = await query(`
      SELECT 
        gs.id as game_set_id, 
        gs.name as game_set_name, 
        gs.description as game_set_description,
        g.id as game_id,
        g.name as game_name,
        g.download_url,
        g.image_url
      FROM 
        game_sets gs
      JOIN 
        games g ON g.game_set_id = gs.id
      JOIN 
        game_codes gc ON gc.game_set_id = gs.id
      WHERE 
        gc.used_by = $1
      ORDER BY 
        gs.name, g.name
    `, [userId]);

    // Format the response to match the previous structure
    const gameSetMap = new Map();
    const processedGameIds = new Set(); // Track processed game IDs to avoid duplicates
    
    for (const row of result.rows) {
      if (!gameSetMap.has(row.game_set_id)) {
        gameSetMap.set(row.game_set_id, {
          id: row.game_set_id,
          name: row.game_set_name,
          description: row.game_set_description,
          games: []
        });
      }
      
      const gameSet = gameSetMap.get(row.game_set_id);
      
      // Only add the game if we haven't processed it yet
      if (!processedGameIds.has(row.game_id)) {
        processedGameIds.add(row.game_id);
        
        gameSet.games.push({
          id: row.game_id,
          name: row.game_name,
          download_url: row.download_url,
          image_url: row.image_url
        });
      }
    }
    
    const games = Array.from(gameSetMap.values());

    return { success: true, games };
  } catch (error) {
    console.error('Error fetching user games:', error);
    throw createError({ statusCode: 500, message: 'Failed to fetch user games' });
  }
});
