
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, DollarSign } from 'lucide-react';
import { CoinBatch } from '@/hooks/useBulkUpload';
import BatchStatusIcon from './BatchStatusIcon';
import BatchStatusBadge from './BatchStatusBadge';
import BatchImagePreview from './BatchImagePreview';

interface BatchListItemProps {
  batch: CoinBatch;
  index: number;
  isCurrentBatch: boolean;
  isProcessing: boolean;
  onRemove: (index: number) => void;
}

const BatchListItem = ({ 
  batch, 
  index, 
  isCurrentBatch, 
  isProcessing, 
  onRemove 
}: BatchListItemProps) => {
  return (
    <div
      className={`p-4 border rounded-lg ${
        isCurrentBatch && isProcessing ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <BatchStatusIcon status={batch.status} />
          <div>
            <h4 className="font-medium">{batch.name}</h4>
            <p className="text-sm text-gray-600">
              {batch.images.length} images
              {batch.aiResult && ` • ${batch.aiResult.name}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <BatchStatusBadge status={batch.status} />
          
          {batch.estimatedValue && (
            <Badge className="bg-green-100 text-green-800">
              <DollarSign className="w-3 h-3 mr-1" />
              ${batch.estimatedValue}
            </Badge>
          )}
          
          <Button
            onClick={() => onRemove(index)}
            size="sm"
            variant="ghost"
            disabled={batch.status === 'processing'}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {batch.status === 'processing' && (
        <Progress value={batch.progress} className="h-1" />
      )}
      
      {batch.error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          Error: {batch.error}
        </div>
      )}
      
      <BatchImagePreview batch={batch} />
    </div>
  );
};

export default BatchListItem;
