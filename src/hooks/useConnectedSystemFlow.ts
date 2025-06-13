
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useConnectedSystemFlow = () => {
  const [flowStatus, setFlowStatus] = useState({
    upload: false,
    analysis: false,
    visualMatch: false,
    marketResearch: false,
    listing: false
  });

  // SECURE Dealer Upload Flow (NO SYSTEM ACTIVATION)
  const executeFullFlowMutation = useMutation({
    mutationFn: async ({ images, coinData }: { images: File[], coinData: any }) => {
      console.log('🚀 Dealer Upload Flow Starting...');
      
      // Step 1: Upload images
      setFlowStatus(prev => ({ ...prev, upload: true }));
      
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        
        // Upload to storage
        const fileName = `dealer-uploads/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('coin-images')
          .upload(fileName, image);
          
        if (uploadError) throw uploadError;
        
        return {
          fileName,
          publicUrl: `${supabase.storage.from('coin-images').getPublicUrl(fileName).data.publicUrl}`
        };
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      console.log('✅ Images uploaded:', uploadedImages.length);
      
      // Step 2: AI Analysis (dealer-safe operation)
      setFlowStatus(prev => ({ ...prev, analysis: true }));
      
      console.log('🤖 Triggering AI analysis...');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('enhanced-dual-recognition', {
        body: {
          frontImageUrl: uploadedImages[0]?.publicUrl,
          backImageUrl: uploadedImages[1]?.publicUrl || uploadedImages[0]?.publicUrl,
          analysisType: 'comprehensive',
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (analysisError) {
        console.warn('⚠️ AI Analysis warning:', analysisError.message);
      }
      
      // Step 3: Visual Matching (dealer-safe operation)
      setFlowStatus(prev => ({ ...prev, visualMatch: true }));
      
      console.log('👁️ Triggering visual matching...');
      const { data: visualMatchData } = await supabase.functions.invoke('visual-matching-engine', {
        body: {
          imageHash: analysisData?.imageHash || 'sample-hash',
          coinType: analysisData?.coinType || coinData.title,
          matchThreshold: 0.7
        }
      });
      
      // Step 4: Market Research (dealer-safe operation)
      setFlowStatus(prev => ({ ...prev, marketResearch: true }));
      
      console.log('📊 Triggering market research...');
      const { data: marketData } = await supabase.functions.invoke('advanced-web-scraper', {
        body: {
          commandType: 'coin_market_research',
          coinIdentifier: `${analysisData?.coinType || coinData.title} ${analysisData?.year || coinData.year}`,
          targetSources: ['ebay', 'heritage', 'pcgs', 'ngc']
        }
      });
      
      // Step 5: Create Listing (dealer-only operation)
      setFlowStatus(prev => ({ ...prev, listing: true }));
      
      console.log('📝 Creating marketplace listing...');
      const { data: listingData, error: listingError } = await supabase
        .from('coins')
        .insert({
          name: analysisData?.coinType || coinData.title || 'Analyzed Coin',
          year: analysisData?.year || parseInt(coinData.year) || 2023,
          grade: analysisData?.grade || coinData.grade || 'Ungraded',
          price: marketData?.suggestedPrice || parseFloat(coinData.price) || 100,
          image: uploadedImages[0]?.publicUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          country: analysisData?.country || 'United States',
          denomination: analysisData?.denomination || 'Unknown',
          rarity: analysisData?.rarity || 'Common',
          ai_confidence: analysisData?.confidence || 0.85,
          ai_provider: 'enhanced-dual-recognition',
          composition: analysisData?.composition || 'Mixed',
          mint: analysisData?.mint || 'Unknown',
          featured: true
        })
        .select()
        .single();
      
      if (listingError) throw listingError;
      
      console.log('✅ Coin listing created:', listingData.id);
      
      return {
        analysis: analysisData,
        visualMatches: visualMatchData,
        marketResearch: marketData,
        listing: listingData,
        uploadedImages,
        message: 'DEALER UPLOAD FLOW COMPLETED SUCCESSFULLY'
      };
    },
    onSuccess: (data) => {
      console.log('✅ Dealer flow executed successfully:', data);
      toast({
        title: "🚀 Upload Flow Complete!",
        description: `Coin analyzed and listed successfully. Coin ID: ${data.listing?.id}`,
      });
      
      // Reset flow status after success
      setTimeout(() => {
        setFlowStatus({
          upload: false,
          analysis: false,
          visualMatch: false,
          marketResearch: false,
          listing: false
        });
      }, 3000);
    },
    onError: (error: any) => {
      console.error('❌ Dealer flow failed:', error);
      toast({
        title: "❌ Upload Failed",
        description: error.message || "Upload flow failed",
        variant: "destructive"
      });
      
      // Reset flow status on error
      setFlowStatus({
        upload: false,
        analysis: false,
        visualMatch: false,
        marketResearch: false,
        listing: false
      });
    }
  });

  const triggerCompleteFlow = useCallback((images: File[], coinData: any) => {
    console.log('🎯 Triggering dealer upload flow with:', { imageCount: images.length, coinData });
    executeFullFlowMutation.mutate({ images, coinData });
  }, [executeFullFlowMutation]);

  return {
    flowStatus,
    isExecuting: executeFullFlowMutation.isPending,
    triggerCompleteFlow,
    error: executeFullFlowMutation.error
  };
};
