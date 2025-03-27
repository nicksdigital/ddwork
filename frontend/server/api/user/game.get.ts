import { defineEventHandler, createError } from 'h3';
import { supabase } from '~/server/utils/supabase';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  // ✅ Get user's activated game sets & games
  const { data: games, error } = await supabase
    .from('user_game_sets')
    .select('game_sets(id, name, description, cover_image, games(id, name, download_url, image_url))')
    .eq('user_id', session.user.id);

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch user games' });
  }

  return { success: true, games };
});
