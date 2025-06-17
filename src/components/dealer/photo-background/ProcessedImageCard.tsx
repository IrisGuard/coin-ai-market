
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ProcessedImageData {
  original: string;
  processed: string;
  filename: string;
}

interface ProcessedImageCardProps {
  image: ProcessedImageData;
  index: number;
  selectedBackgroundName: string;
  onDownload: (image: ProcessedImageData) => void;
}

export const ProcessedImageCard: React.FC<ProcessedImageCardProps> = ({
  image,
  index,
  selectedBackgroundName,
  onDownload
}) => {
  return (
    <div className="space-y-3 border rounded-lg p-3">
      {/* Before/After Comparison */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Original</p>
          <img
            src={image.original}
            alt={`Original ${index + 1}`}
            className="w-full h-24 object-cover rounded border"
            onError={(e) => {
              console.error('🚨 Original image failed to load:', image.original);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('✅ Original image loaded successfully:', image.original?.substring(0, 50));
            }}
          />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Processed</p>
          <img
            src={image.processed}
            alt={`Processed ${index + 1}`}
            className="w-full h-24 object-cover rounded border"
            onError={(e) => {
              console.error('🚨 Processed image failed to load:', image.processed);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('✅ Processed image loaded successfully:', image.processed?.substring(0, 50));
            }}
          />
        </div>
      </div>
      
      {/* File Info and Actions */}
      <div className="space-y-2">
        <div className="text-sm">
          <div className="font-medium truncate">{image.filename}</div>
          <div className="text-muted-foreground text-xs">
            Background: {selectedBackgroundName}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(image)}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};
