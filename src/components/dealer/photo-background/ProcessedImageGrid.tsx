
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProcessedImageCard } from './ProcessedImageCard';

interface ProcessedImageData {
  original: string;
  processed: string;
  filename: string;
}

interface ProcessedImageGridProps {
  processedImages: ProcessedImageData[];
  selectedBackgroundName: string;
  onClearAll: () => void;
  onDownload: (image: ProcessedImageData) => void;
}

export const ProcessedImageGrid: React.FC<ProcessedImageGridProps> = ({
  processedImages,
  selectedBackgroundName,
  onClearAll,
  onDownload
}) => {
  if (processedImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Processed Images</h3>
        <Button variant="outline" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processedImages.map((img, index) => (
          <ProcessedImageCard
            key={index}
            image={img}
            index={index}
            selectedBackgroundName={selectedBackgroundName}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};
