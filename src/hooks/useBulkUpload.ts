import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logError } from '@/utils/errorHandler';

interface RecognizedCoinData {
  name: string;
  year: number;
  grade?: string;
  estimatedValue?: number;
  rarity?: string;
  country?: string;
  denomination?: string;
  description?: string;
  composition?: string;
  diameter?: number;
  weight?: number;
  mint?: string;
}

interface CoinUploadItem {
  imageUrl: string;
  recognizedData: RecognizedCoinData;
}

export const useBulkUpload = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetProgress = () => {
    setUploadProgress(0);
  };

  const updateProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const bulkCreateCoins = useMutation({
    mutationFn: async (items: CoinUploadItem[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const totalItems = items.length;
      let successfulUploads = 0;

      for (const [index, item] of items.entries()) {
        try {
          const coinData = {
            name: item.recognizedData.name,
            year: item.recognizedData.year,
            grade: item.recognizedData.grade || 'Unknown',
            price: item.recognizedData.estimatedValue || 0,
            rarity: (item.recognizedData.rarity || 'Common') as any,
            image: item.imageUrl,
            country: item.recognizedData.country,
            denomination: item.recognizedData.denomination,
            description: item.recognizedData.description,
            composition: item.recognizedData.composition,
            diameter: item.recognizedData.diameter,
            weight: item.recognizedData.weight,
            mint: item.recognizedData.mint,
          };

          const { error } = await supabase
            .from('coins')
            .insert([{
              ...coinData,
              user_id: user.id,
              authentication_status: 'pending'
            }]);

          if (error) {
            console.error('Error uploading coin:', error);
            logError(error, `Bulk upload failed for coin: ${coinData.name}`);
          } else {
            successfulUploads++;
          }
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          logError(uploadError, `Bulk upload general error for coin: ${item.recognizedData.name}`);
        } finally {
          const progress = ((index + 1) / totalItems) * 100;
          updateProgress(progress);
        }
      }

      if (successfulUploads === totalItems) {
        toast({
          title: "Bulk Upload Complete",
          description: `Successfully uploaded ${successfulUploads} coins.`,
        });
      } else {
        toast({
          title: "Bulk Upload Partially Complete",
          description: `Uploaded ${successfulUploads} out of ${totalItems} coins. Check console for errors.`,
          variant: 'warning',
        });
      }

      return { total: totalItems, successful: successfulUploads };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      resetProgress();
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Upload Error",
        description: error.message,
        variant: "destructive",
      });
      resetProgress();
      logError(error, 'Bulk upload general error');
    },
  });

  return { bulkCreateCoins, uploadProgress };
};
