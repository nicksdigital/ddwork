import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import { validateUser, generateToken } from '../../utils/auth';
import { query } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      });
    }

    // Validate user credentials
    const user = await validateUser(email, password);

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      });
    }

    // Generate authentication token
    const token = generateToken(user.id);

    // Set token in HTTP-only cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Return user info (excluding sensitive data)
    const userInfo = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    return { 
      success: true, 
      message: 'Login successful',
      user: userInfo
    };
  } catch (error: any) {
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'An error occurred during login' 
    });
  }
});
