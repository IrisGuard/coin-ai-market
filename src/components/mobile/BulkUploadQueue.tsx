
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinBatch } from '@/hooks/useBulkUpload';
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
  if (batches.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Processing Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {batches.map((batch, index) => (
            <BatchListItem
              key={batch.id}
              batch={batch}
              index={index}
              isCurrentBatch={currentBatchIndex === index}
              isProcessing={isProcessing}
              onRemove={onRemoveBatch}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUploadQueue;
