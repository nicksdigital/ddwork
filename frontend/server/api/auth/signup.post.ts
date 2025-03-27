import { defineEventHandler, readBody, createError } from 'h3';
import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { email, password, username } = await readBody(event);

  if (!email || !password || !username) {
    throw createError({ statusCode: 400, message: 'All fields are required.' });
  }

  // ✅ Check if username is already taken
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw createError({ statusCode: 409, message: 'Username already exists.' });
  }

  // ✅ Create user with Supabase auth
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });
  console.log(user);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true, message: 'Signup successful! Please check your email to verify your account.' };
});
