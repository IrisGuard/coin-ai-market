
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CoinUploadItem {
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: string;
  image: string;
  country?: string;
  denomination?: string;
  description?: string;
  condition?: string;
}

export interface CoinBatch {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  coins: CoinUploadItem[];
  progress: number;
  error?: string;
}

export const useBulkUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const bulkCreateCoins = useMutation({
    mutationFn: async (coins: CoinUploadItem[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const coinsToInsert = coins.map(coin => ({
        name: coin.name,
        year: coin.year,
        grade: coin.grade,
        price: coin.price,
        rarity: coin.rarity,
        image: coin.image,
        user_id: user.id,
        authentication_status: 'pending',
        country: coin.country,
        denomination: coin.denomination,
        description: coin.description,
        condition: coin.condition
      }));

      const { data, error } = await supabase
        .from('coins')
        .insert(coinsToInsert)
        .select();

      if (error) throw error;

      return {
        total: coins.length,
        successful: data?.length || 0
      };
    },
    onSuccess: (result) => {
      toast({
        title: "Bulk Upload Complete",
        description: `Successfully uploaded ${result.successful} out of ${result.total} coins.`,
      });
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  return {
    bulkCreateCoins,
    uploadProgress
  };
};
