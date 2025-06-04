
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Pause, 
  Play, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { CoinBatch } from '@/hooks/useBulkUpload';

interface BulkUploadHeaderProps {
  batches: CoinBatch[];
  isProcessing: boolean;
  isPaused: boolean;
  overallProgress: number;
  onFileUpload: (files: File[]) => void;
  onStartProcessing: () => void;
  onPauseProcessing: () => void;
  onResumeProcessing: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

const BulkUploadHeader = ({
  batches,
  isProcessing,
  isPaused,
  overallProgress,
  onFileUpload,
  onStartProcessing,
  onPauseProcessing,
  onResumeProcessing,
  onRetryFailed,
  onClearCompleted
}: BulkUploadHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    onFileUpload(files);
  };

  const completedCount = batches.filter(b => b.status === 'completed').length;
  const failedCount = batches.filter(b => b.status === 'failed').length;
  const totalValue = batches
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.estimatedValue || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Bulk Coin Upload Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
            disabled={isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Coin Images
          </Button>
          
          {batches.length > 0 && !isProcessing && (
            <Button
              onClick={onStartProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </Button>
          )}
          
          {isProcessing && !isPaused && (
            <Button
              onClick={onPauseProcessing}
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {isPaused && (
            <Button
              onClick={onResumeProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
        </div>

        {/* Overall Progress */}
        {batches.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* Statistics */}
        {batches.length > 0 && (
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{batches.length}</div>
              <div className="text-xs text-blue-600">Total Batches</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedCount}</div>
              <div className="text-xs text-red-600">Failed</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${totalValue.toFixed(0)}</div>
              <div className="text-xs text-purple-600">Total Value</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {batches.length > 0 && (
          <div className="flex gap-2">
            {failedCount > 0 && (
              <Button
                onClick={onRetryFailed}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Failed ({failedCount})
              </Button>
            )}
            
            {completedCount > 0 && (
              <Button
                onClick={onClearCompleted}
                variant="outline"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Clear Completed ({completedCount})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkUploadHeader;
