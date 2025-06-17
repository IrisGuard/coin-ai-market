
import React from 'react';
import { Zap } from 'lucide-react';

interface ProcessingProgressProps {
  isProcessing: boolean;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ isProcessing }) => {
  if (!isProcessing) {
    return null;
  }

  return (
    <div className="text-center">
      <div className="animate-pulse">
        <Zap className="h-8 w-8 mx-auto text-purple-600 mb-2" />
        <p className="text-purple-600 font-medium">Processing images with selected background...</p>
      </div>
    </div>
  );
};
