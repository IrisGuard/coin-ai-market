
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://saimszsekjafmqqcvcgx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhaW1zenNla2phZm1xcWN2Y2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MzM4NjcsImV4cCI6MjA2MzAwOTg2N30.o5x0i7u4NJ20RPb9hjBaRsjvDdTw6rwwkc-SDx1Morw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to upload coin images
export const uploadCoinImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `coin_images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('coins')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('coins')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
};
