import { defineEventHandler, readBody, createError } from 'h3';
import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw createError({ statusCode: 401, message: error.message });
  }

  return { success: true, user: data.user };
});
