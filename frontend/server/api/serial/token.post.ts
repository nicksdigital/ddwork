import { defineEventHandler, readBody, createError } from 'h3';
import { query } from '../../utils/db';
import { createSerialToken } from '../../utils/tokenStore';

export default defineEventHandler(async (event) => {
  try {
    const { serial } = await readBody(event);

    if (!serial) {
      throw createError({
        statusCode: 400,
        message: 'Serial number is required'
      });
    }

    // Validate the serial number
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
      throw createError({
        statusCode: 400,
        message: 'Invalid serial number'
      });
    }

    const gameCode = result.rows[0];

    // Check if serial is already used
    if (gameCode.is_used && gameCode.used_by) {
      throw createError({
        statusCode: 400,
        message: 'This serial number has already been used'
      });
    }

    // Generate a token for this serial
    const token = createSerialToken(serial);

    return {
      success: true,
      token,
      message: 'Serial number is valid'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred validating the serial number'
    });
  }
});
