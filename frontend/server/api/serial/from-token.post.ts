import { defineEventHandler, readBody, createError } from 'h3';
import { getSerialFromToken } from '../../utils/tokenStore';

export default defineEventHandler(async (event) => {
  try {
    const { token } = await readBody(event);

    if (!token) {
      throw createError({
        statusCode: 400,
        message: 'Token is required'
      });
    }

    // Get the serial number from the token
    const serial = getSerialFromToken(token);

    if (!serial) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or expired token'
      });
    }

    return {
      success: true,
      serial,
      message: 'Serial number retrieved successfully'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred retrieving the serial number'
    });
  }
});
