
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Zap } from 'lucide-react';

interface ImageUploadAreaProps {
  isProcessing: boolean;
  selectedBackgroundName: string;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  isProcessing,
  selectedBackgroundName,
  onFileSelect
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium mb-2">Upload Photos for Background Processing</p>
      <p className="text-sm text-gray-500 mb-4">
        Selected background: <span className="font-medium">{selectedBackgroundName}</span>
      </p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
        id="background-upload"
        disabled={isProcessing}
      />
      <label htmlFor="background-upload">
        <Button asChild disabled={isProcessing}>
          <span>
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
};
