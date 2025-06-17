
import { supabase } from '@/integrations/supabase/client';
import { getRarityScore } from './analysisHelpers';

export const generateImageHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const saveEnhancedResults = async (mergedData: any, imageFile: File) => {
  try {
    // Upload image to get URL
    const imageHash = await generateImageHash(imageFile);
    const fileName = `${imageHash}.${imageFile.type.split('/')[1]}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('coin-images')
      .upload(fileName, imageFile, { upsert: true });
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('coin-images')
      .getPublicUrl(fileName);
    
    const { data, error } = await supabase
      .from('dual_image_analysis')
      .insert({
        front_image_url: publicUrl,
        back_image_url: publicUrl, // Using same image for both sides for now
        front_image_hash: imageHash,
        back_image_hash: imageHash,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        analysis_results: mergedData,
        confidence_score: mergedData.confidence,
        estimated_value_range: {
          low: mergedData.market_value * 0.8,
          high: mergedData.market_value * 1.2,
          average: mergedData.market_value
        },
        grade_assessment: mergedData.grade,
        detected_errors: mergedData.errors || [],
        rarity_score: getRarityScore(mergedData.rarity)
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to save enhanced results:', error);
      throw error;
    }
    
    return data?.id;
  } catch (error) {
    console.error('saveEnhancedResults error:', error);
    return null;
  }
};
