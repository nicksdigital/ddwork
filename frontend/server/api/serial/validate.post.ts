import { defineEventHandler, readBody, createError } from 'h3';
import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const { serial } = await readBody(event);
  console.log(serial);
  if (!serial) {
    throw createError({ statusCode: 400, message: 'Serial number is required' });
  }



  try {

    // ✅ Check if serial exists in Supabase
    let { data, error } = await supabase
    .rpc('is_valid_serial', {
      serial
    })

    console.log(data);


  if (error || !data) {
    console.log(error);
  //  throw createError({ statusCode: 404, message: 'Invalid serial number' });
    return { success: false, message: 'Invalid serial number' };
  }

  // ✅ Check if serial is already used
  if (data.used_by) {

    return { success: false, message: 'This serial number has already been used.' };
  }
  } catch (error) {
    console.log(error);
  }
  return { success: true, message: 'Serial number is valid. Proceed to account creation.' };
  
});
