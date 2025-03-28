import { defineEventHandler, readBody, createError } from 'h3';
import { query } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const { serial } = await readBody(event);
  console.log('Validating serial:', serial);
  
  if (!serial) {
    throw createError({ statusCode: 400, message: 'Serial number is required' });
  }

  try {
    // Check if serial exists in the database and if it's already used
    const result = await query(`
      SELECT 
        code, 
        is_used, 
        used_by,
        game_set_id
      FROM 
        game_codes 
      WHERE 
        code = $1
    `, [serial]);

    if (result.rows.length === 0) {
      console.log('Invalid serial number:', serial);
      return { success: false, message: 'Invalid serial number' };
    }

    const gameCode = result.rows[0];

    // Check if serial is already used
    if (gameCode.is_used && gameCode.used_by) {
      console.log('Serial already used:', serial);
      return { success: false, message: 'This serial number has already been used.' };
    }

    // Get game set information
    const gameSetResult = await query(`
      SELECT name, description
      FROM game_sets
      WHERE id = $1
    `, [gameCode.game_set_id]);

    const gameSet = gameSetResult.rows[0];
    
    return { 
      success: true, 
      message: 'Serial number is valid. Proceed to account creation.',
      gameSet: {
        id: gameCode.game_set_id,
        name: gameSet.name,
        description: gameSet.description
      }
    };
  } catch (error) {
    console.error('Error validating serial:', error);
    throw createError({ statusCode: 500, message: 'Error validating serial number' });
  }
});
