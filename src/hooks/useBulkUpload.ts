
import { useState } from 'react';
import { useCreateCoin, useAICoinRecognition } from '@/hooks/useCoins';
import { toast } from '@/hooks/use-toast';

export interface CoinBatch {
  id: string;
  name: string;
  images: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  aiResult?: any;
  error?: string;
  estimatedValue?: number;
}

export const useBulkUpload = () => {
  const [batches, setBatches] = useState<CoinBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const createCoin = useCreateCoin();
  const aiRecognition = useAICoinRecognition();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addBatches = (files: File[]) => {
    const newBatches: CoinBatch[] = [];
    let currentImages: File[] = [];
    let batchIndex = 1;

    files.forEach((file, index) => {
      currentImages.push(file);
      
      if (currentImages.length >= 2 && (currentImages.length >= 4 || index === files.length - 1)) {
        newBatches.push({
          id: `batch-${Date.now()}-${batchIndex}`,
          name: `Coin ${batchIndex}`,
          images: [...currentImages],
          status: 'pending',
          progress: 0
        });
        currentImages = [];
        batchIndex++;
      }
    });

    setBatches(prev => [...prev, ...newBatches]);
    
    toast({
      title: "Images Added",
      description: `Added ${newBatches.length} coin batches for processing`,
    });
  };

  const processBatch = async (batch: CoinBatch, index: number) => {
    try {
      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, status: 'processing', progress: 0 } : b
      ));

      const primaryImage = await convertFileToBase64(batch.images[0]);
      const additionalImages = await Promise.all(
        batch.images.slice(1).map(img => convertFileToBase64(img))
      );

      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, progress: 25 } : b
      ));

      const aiResult = await aiRecognition.mutateAsync({
        image: primaryImage,
        additionalImages
      });

      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, progress: 50, aiResult } : b
      ));

      await createCoin.mutateAsync({
        name: aiResult?.name || 'Unidentified Coin',
        year: aiResult?.year || new Date().getFullYear(),
        country: aiResult?.country || 'Unknown',
        grade: aiResult?.grade || 'Ungraded',
        price: aiResult?.estimated_value || 10,
        rarity: aiResult?.rarity || 'Common',
        condition: aiResult?.condition || 'Good',
        composition: aiResult?.composition || 'Unknown',
        diameter: aiResult?.diameter,
        weight: aiResult?.weight,
        mint: aiResult?.mint || 'Unknown',
        description: aiResult?.description || 'Bulk uploaded coin',
        image: primaryImage,
      });

      setBatches(prev => prev.map((b, i) => 
        i === index ? { 
          ...b, 
          status: 'completed', 
          progress: 100,
          estimatedValue: aiResult?.estimated_value || 10
        } : b
      ));

    } catch (error) {
      console.error('Error processing batch:', error);
      setBatches(prev => prev.map((b, i) => 
        i === index ? { 
          ...b, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Processing failed'
        } : b
      ));
    }
  };

  const startBulkProcessing = async (onComplete?: () => void) => {
    setIsProcessing(true);
    setIsPaused(false);
    
    const pendingBatches = batches.filter(b => b.status === 'pending' || b.status === 'failed');
    
    for (let i = 0; i < pendingBatches.length; i++) {
      if (isPaused) break;
      
      const batchIndex = batches.findIndex(b => b.id === pendingBatches[i].id);
      setCurrentBatchIndex(batchIndex);
      
      await processBatch(pendingBatches[i], batchIndex);
      
      const completedCount = batches.filter(b => b.status === 'completed').length + i + 1;
      setOverallProgress((completedCount / batches.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsProcessing(false);
    
    toast({
      title: "Bulk Upload Complete",
      description: `Processed ${batches.filter(b => b.status === 'completed').length} coins successfully`,
    });
    
    onComplete?.();
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
  };

  const resumeProcessing = (onComplete?: () => void) => {
    setIsPaused(false);
    startBulkProcessing(onComplete);
  };

  const removeBatch = (index: number) => {
    setBatches(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setBatches(prev => prev.filter(b => b.status !== 'completed'));
  };

  const retryFailed = () => {
    setBatches(prev => prev.map(b => 
      b.status === 'failed' ? { ...b, status: 'pending', error: undefined } : b
    ));
  };

  return {
    batches,
    isProcessing,
    isPaused,
    currentBatchIndex,
    overallProgress,
    addBatches,
    startBulkProcessing,
    pauseProcessing,
    resumeProcessing,
    removeBatch,
    clearCompleted,
    retryFailed
  };
};
