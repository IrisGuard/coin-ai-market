
import React from 'react';
import { useBulkUpload } from '@/hooks/useBulkUpload';
import BulkUploadHeader from './BulkUploadHeader';
import BulkUploadQueue from './BulkUploadQueue';
import BulkUploadEmptyState from './BulkUploadEmptyState';

interface BulkCoinUploadManagerProps {
  onComplete?: () => void;
}

const BulkCoinUploadManager = ({ onComplete }: BulkCoinUploadManagerProps) => {
  const {
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
  } = useBulkUpload();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <BulkUploadHeader
        batches={batches}
        isProcessing={isProcessing}
        isPaused={isPaused}
        overallProgress={overallProgress}
        onFileUpload={addBatches}
        onStartProcessing={() => startBulkProcessing(onComplete)}
        onPauseProcessing={pauseProcessing}
        onResumeProcessing={() => resumeProcessing(onComplete)}
        onRetryFailed={retryFailed}
        onClearCompleted={clearCompleted}
      />

      <BulkUploadQueue
        batches={batches}
        currentBatchIndex={currentBatchIndex}
        isProcessing={isProcessing}
        onRemoveBatch={removeBatch}
      />

      {batches.length === 0 && <BulkUploadEmptyState />}
    </div>
  );
};

export default BulkCoinUploadManager;
