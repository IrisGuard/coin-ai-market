
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

  // Enhanced upload with full flow
  const executeFullFlowMutation = useMutation({
    mutationFn: async ({ images, coinData }: { images: File[], coinData: any }) => {
      console.log('🚀 Starting connected system flow...');
      
      // Step 1: Upload and analyze
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
      
      // Step 2: AI Analysis
      setFlowStatus(prev => ({ ...prev, analysis: true }));
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('enhanced-dual-recognition', {
        body: {
          frontImageUrl: uploadedImages[0]?.publicUrl,
          backImageUrl: uploadedImages[1]?.publicUrl || uploadedImages[0]?.publicUrl,
          analysisType: 'comprehensive'
        }
      });
      
      if (analysisError) throw analysisError;
      
      // Step 3: Visual Matching
      setFlowStatus(prev => ({ ...prev, visualMatch: true }));
      
      const { data: visualMatchData } = await supabase.functions.invoke('visual-matching-engine', {
        body: {
          imageHash: analysisData?.imageHash,
          coinType: analysisData?.coinType,
          matchThreshold: 0.7
        }
      });
      
      // Step 4: Market Research
      setFlowStatus(prev => ({ ...prev, marketResearch: true }));
      
      const { data: marketData } = await supabase.functions.invoke('advanced-web-scraper', {
        body: {
          commandType: 'coin_market_research',
          coinIdentifier: `${analysisData?.coinType} ${analysisData?.year}`,
          targetSources: ['ebay', 'heritage', 'pcgs', 'ngc']
        }
      });
      
      // Step 5: Create Listing
      setFlowStatus(prev => ({ ...prev, listing: true }));
      
      const { data: listingData, error: listingError } = await supabase
        .from('coins')
        .insert({
          name: analysisData?.coinType || coinData.title,
          year: analysisData?.year || parseInt(coinData.year),
          grade: analysisData?.grade || coinData.grade,
          price: marketData?.suggestedPrice || parseFloat(coinData.price),
          image: uploadedImages[0]?.publicUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          country: analysisData?.country || 'United States',
          denomination: analysisData?.denomination || 'Unknown',
          rarity: analysisData?.rarity || 'Common',
          ai_confidence: analysisData?.confidence || 0.5,
          ai_provider: 'enhanced-dual-recognition'
        })
        .select()
        .single();
      
      if (listingError) throw listingError;
      
      return {
        analysis: analysisData,
        visualMatches: visualMatchData,
        marketResearch: marketData,
        listing: listingData,
        uploadedImages
      };
    },
    onSuccess: (data) => {
      console.log('✅ Complete flow executed successfully:', data);
      toast({
        title: "Complete Flow Executed!",
        description: `Coin analyzed, matched, researched, and listed successfully`,
      });
      
      // Reset flow status
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
      console.error('❌ Flow execution failed:', error);
      toast({
        title: "Flow Failed",
        description: error.message || "Complete system flow failed",
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
    executeFullFlowMutation.mutate({ images, coinData });
  }, [executeFullFlowMutation]);

  return {
    flowStatus,
    isExecuting: executeFullFlowMutation.isPending,
    triggerCompleteFlow,
    error: executeFullFlowMutation.error
  };
};
