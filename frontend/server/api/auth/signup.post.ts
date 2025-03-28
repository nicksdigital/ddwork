import { defineEventHandler, readBody, createError } from 'h3';
import { createUser, generateToken } from '../../utils/auth';
import { query } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const { email, password, username, serial } = await readBody(event);

    if (!email || !password || !username || !serial) {
      throw createError({
        statusCode: 400,
        message: 'Email, password, username and serial number are required'
      });
    }

    // Validate the serial number
    const serialResult = await query(`
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

    if (serialResult.rows.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid serial number'
      });
    }

    const gameCode = serialResult.rows[0];

    // Check if serial is already used
    if (gameCode.is_used && gameCode.used_by) {
      throw createError({
        statusCode: 400,
        message: 'This serial number has already been used'
      });
    }

    // Create the user
    const user = await createUser(email, password);

    // Mark the serial as used by this user
    await query(`
      UPDATE game_codes
      SET is_used = true, used_by = $1, used_at = CURRENT_TIMESTAMP
      WHERE code = $2
    `, [user.id, serial]);

    // Generate authentication token
    const token = generateToken(user.id);

    return { 
      success: true, 
      message: 'Account created successfully! Please log in to access your games.' 
    };
  } catch (error: any) {
    if (error.code === '23505') { // PostgreSQL unique violation error
      throw createError({
        statusCode: 400,
        message: 'Email already exists'
      });
    }
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'An error occurred during signup' 
    });
  }
});
