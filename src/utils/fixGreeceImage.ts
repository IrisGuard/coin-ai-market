
import { supabase } from '@/integrations/supabase/client';

export const fixGreeceImageDisplay = async () => {
  try {
    console.log('🏛️ FIXING GREECE COIN IMAGE DISPLAY...');
    
    // Find the Greece coin
    const { data: greeceCoin, error: fetchError } = await supabase
      .from('coins')
      .select('*')
      .ilike('name', '%GREECE COIN 10 LEPTA DOUBLED DIE ERROR%')
      .single();

    if (fetchError || !greeceCoin) {
      console.error('❌ Greece coin not found:', fetchError);
      return { success: false, error: 'Coin not found' };
    }

    console.log('🔍 Found Greece coin:', {
      id: greeceCoin.id,
      name: greeceCoin.name,
      currentImages: greeceCoin.images,
      imageField: greeceCoin.image,
      obverseImage: greeceCoin.obverse_image,
      reverseImage: greeceCoin.reverse_image
    });

    // Collect all available image URLs
    const allImageUrls: string[] = [];
    
    // Add from individual fields
    if (greeceCoin.image && !greeceCoin.image.startsWith('blob:')) {
      allImageUrls.push(greeceCoin.image);
    }
    if (greeceCoin.obverse_image && !greeceCoin.obverse_image.startsWith('blob:')) {
      allImageUrls.push(greeceCoin.obverse_image);
    }
    if (greeceCoin.reverse_image && !greeceCoin.reverse_image.startsWith('blob:')) {
      allImageUrls.push(greeceCoin.reverse_image);
    }
    
    // Add from images array if it exists and has valid URLs
    if (greeceCoin.images && Array.isArray(greeceCoin.images)) {
      const validImagesFromArray = greeceCoin.images.filter(
        (img: string) => img && !img.startsWith('blob:') && !allImageUrls.includes(img)
      );
      allImageUrls.push(...validImagesFromArray);
    }

    // If we have images, update the database to ensure the images array is properly populated
    if (allImageUrls.length > 0) {
      const { data: updatedCoin, error: updateError } = await supabase
        .from('coins')
        .update({
          images: allImageUrls,
          // Ensure we have a primary image
          image: allImageUrls[0],
          // Feature the coin as it's an error coin
          featured: true,
          category: 'error_coin',
          updated_at: new Date().toISOString()
        })
        .eq('id', greeceCoin.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Failed to update Greece coin:', updateError);
        return { success: false, error: updateError.message };
      }

      console.log('✅ GREECE COIN FIXED SUCCESSFULLY:', {
        coinId: updatedCoin.id,
        name: updatedCoin.name,
        totalImages: allImageUrls.length,
        imagesArray: updatedCoin.images,
        featured: updatedCoin.featured,
        category: updatedCoin.category
      });

      return { 
        success: true, 
        coinId: updatedCoin.id,
        imageCount: allImageUrls.length,
        images: updatedCoin.images
      };
    } else {
      console.log('⚠️ No valid images found for Greece coin');
      return { success: false, error: 'No valid images found' };
    }

  } catch (error) {
    console.error('❌ Error fixing Greece coin:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
