
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Camera, Upload, CheckCircle } from 'lucide-react';

interface CompactImageUploaderProps {
  images: any[];
  dragActive: boolean;
  onFilesSelected: (files: File[]) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

const CompactImageUploader = ({ 
  images, 
  dragActive, 
  onFilesSelected, 
  onDrag, 
  onDrop, 
  onRemoveImage,
  maxImages = 10 
}: CompactImageUploaderProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Coin Images</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <Camera className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-lg font-medium">Upload coin images</p>
        <p className="text-sm text-gray-500 mb-2">
          You may upload up to {maxImages} images (front, back, details)
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Supported formats: JPG, PNG, WebP | Max size: 10MB per image
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && onFilesSelected(Array.from(e.target.files))}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button className="cursor-pointer" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              Select Images
            </span>
          </Button>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              Uploaded Images ({images.length}/{maxImages})
            </Label>
            {images.length >= maxImages && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                Maximum reached
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.slice(0, maxImages).map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Coin ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                >
                  ×
                </Button>
                {image.uploaded && (
                  <div className="absolute bottom-1 left-1">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactImageUploader;
