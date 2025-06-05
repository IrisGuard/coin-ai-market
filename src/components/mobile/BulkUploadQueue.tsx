
import React from 'react';
import { CoinBatch } from '@/types/batch';
import BatchListItem from './BatchListItem';

interface BulkUploadQueueProps {
  batches: CoinBatch[];
  currentBatchIndex: number;
  isProcessing: boolean;
  onRemoveBatch: (index: number) => void;
}

const BulkUploadQueue = ({
  batches,
  currentBatchIndex,
  isProcessing,
  onRemoveBatch
}: BulkUploadQueueProps) => {
  if (batches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Processing Queue</h3>
        <p className="text-sm text-gray-600 mt-1">
          {batches.length} batch{batches.length !== 1 ? 'es' : ''} in queue
        </p>
      </div>
      
      <div className="divide-y">
        {batches.map((batch, index) => (
          <BatchListItem
            key={batch.id}
            batch={batch}
            index={index}
            isActive={index === currentBatchIndex && isProcessing}
            onRemove={() => onRemoveBatch(index)}
            canRemove={batch.status === 'pending' || batch.status === 'failed'}
          />
        ))}
      </div>
    </div>
  );
};

export default BulkUploadQueue;
