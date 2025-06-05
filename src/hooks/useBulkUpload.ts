
import { useState, useCallback } from 'react';
import { CoinBatch } from '@/types/batch';

export const useBulkUpload = () => {
  const [batches, setBatches] = useState<CoinBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

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

  const startBulkProcessing = useCallback(async (onComplete?: () => void) => {
    setIsProcessing(true);
    setIsPaused(false);
    
    // Simulate processing logic
    for (let i = 0; i < batches.length; i++) {
      if (isPaused) break;
      
      setCurrentBatchIndex(i);
      setBatches(prev => prev.map((batch, idx) => 
        idx === i ? { ...batch, status: 'processing' as const } : batch
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBatches(prev => prev.map((batch, idx) => 
        idx === i ? { 
          ...batch, 
          status: 'completed' as const, 
          progress: 100,
          estimatedValue: Math.floor(Math.random() * 1000) + 100
        } : batch
      ));
    }
    
    setIsProcessing(false);
    onComplete?.();
  }, [batches, isPaused]);

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

export { CoinBatch };
