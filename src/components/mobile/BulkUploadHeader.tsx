
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { CoinBatch } from '@/types/batch';

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const pendingBatches = batches.filter(b => b.status === 'pending').length;
  const failedBatches = batches.filter(b => b.status === 'failed').length;
  const completedBatches = batches.filter(b => b.status === 'completed').length;

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Bulk Coin Upload</h2>
        <div className="flex gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="bulk-file-upload"
          />
          <label htmlFor="bulk-file-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Add Images
            </Button>
          </label>
        </div>
      </div>

      {batches.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{batches.length}</div>
              <div className="text-sm text-gray-600">Total Batches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingBatches}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedBatches}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedBatches}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {!isProcessing && !isPaused && pendingBatches > 0 && (
              <Button onClick={onStartProcessing} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Processing
              </Button>
            )}
            
            {isProcessing && (
              <Button onClick={onPauseProcessing} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button onClick={onResumeProcessing} className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            
            {failedBatches > 0 && (
              <Button onClick={onRetryFailed} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Failed ({failedBatches})
              </Button>
            )}
            
            {completedBatches > 0 && (
              <Button onClick={onClearCompleted} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Completed ({completedBatches})
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadHeader;
