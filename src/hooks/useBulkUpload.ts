
import { useState, useCallback } from 'react';
import { CoinBatch } from '@/types/batch';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCreateCoin } from '@/hooks/useCoinMutations';
import { toast } from '@/hooks/use-toast';

export const useBulkUpload = () => {
  const [batches, setBatches] = useState<CoinBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  
  const aiRecognition = useRealAICoinRecognition();
  const createCoin = useCreateCoin();

  const addBatches = useCallback((files: File[]) => {
    const newBatches: CoinBatch[] = files.map((file, index) => ({
      id: `batch-${Date.now()}-${index}`,
      name: file.name,
      images: [file],
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    setBatches(prev => [...prev, ...newBatches]);
  }, []);

  const processBatch = async (batch: CoinBatch): Promise<void> => {
    try {
      setBatches(prev => prev.map(b => 
        b.id === batch.id ? { ...b, status: 'processing' as const, progress: 25 } : b
      ));

      setBatches(prev => prev.map(b => 
        b.id === batch.id ? { ...b, progress: 50 } : b
      ));

      // Real AI analysis using the correct API
      const aiResult = await aiRecognition.analyzeImage(batch.images[0]);

      setBatches(prev => prev.map(b => 
        b.id === batch.id ? { ...b, progress: 75 } : b
      ));

      if (aiResult) {
        // Convert image to base64 for storage
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(batch.images[0]);
        });
        const base64Image = await base64Promise;

        // Create coin with AI results
        const coinData = {
          name: aiResult.name || 'Unknown Coin',
          year: aiResult.year || new Date().getFullYear(),
          grade: aiResult.grade || 'Ungraded',
          price: aiResult.estimatedValue || 0,
          rarity: aiResult.rarity || 'common',
          image: base64Image,
          country: aiResult.country || '',
          denomination: aiResult.denomination || '',
          description: `AI-identified coin with ${Math.round(aiResult.confidence * 100)}% confidence`,
        };

        await createCoin.mutateAsync(coinData);

        setBatches(prev => prev.map(b => 
          b.id === batch.id ? { 
            ...b, 
            status: 'completed' as const, 
            progress: 100,
            estimatedValue: aiResult.estimatedValue || 0
          } : b
        ));
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      console.error('Batch processing error:', error);
      setBatches(prev => prev.map(b => 
        b.id === batch.id ? { ...b, status: 'failed' as const, progress: 0 } : b
      ));
      
      toast({
        title: "Processing Failed",
        description: `Failed to process ${batch.name}`,
        variant: "destructive",
      });
    }
  };

  const startBulkProcessing = useCallback(async (onComplete?: () => void) => {
    setIsProcessing(true);
    setIsPaused(false);
    
    const pendingBatches = batches.filter(b => b.status === 'pending' || b.status === 'failed');
    
    for (let i = 0; i < pendingBatches.length; i++) {
      if (isPaused) break;
      
      setCurrentBatchIndex(i);
      await processBatch(pendingBatches[i]);
      
      // Small delay between batches to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsProcessing(false);
    onComplete?.();
    
    toast({
      title: "Bulk Processing Complete",
      description: `Processed ${pendingBatches.length} coins successfully`,
    });
  }, [batches, isPaused, aiRecognition, createCoin]);

  const pauseProcessing = useCallback(() => {
    setIsPaused(true);
    setIsProcessing(false);
  }, []);

  const resumeProcessing = useCallback((onComplete?: () => void) => {
    setIsPaused(false);
    startBulkProcessing(onComplete);
  }, [startBulkProcessing]);

  const removeBatch = useCallback((index: number) => {
    setBatches(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCompleted = useCallback(() => {
    setBatches(prev => prev.filter(batch => batch.status !== 'completed'));
  }, []);

  const retryFailed = useCallback(() => {
    setBatches(prev => prev.map(batch => 
      batch.status === 'failed' ? { ...batch, status: 'pending' } : batch
    ));
  }, []);

  const overallProgress = batches.length > 0 
    ? (batches.filter(b => b.status === 'completed').length / batches.length) * 100 
    : 0;

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
