
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

interface ImageUploadCardProps {
  images: UploadedImage[];
  dragActive: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onUploadAndAnalyze: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImageUploadCard = ({
  images,
  dragActive,
  uploadProgress,
  isAnalyzing,
  onDrag,
  onDrop,
  onImageSelect,
  onRemoveImage,
  onUploadAndAnalyze,
  fileInputRef
}: ImageUploadCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-indigo-600" />
          Coin Photos ({images.length}/5)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-indigo-300 bg-gradient-to-br from-indigo-50/50 to-blue-50/50'
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <Camera className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Upload High-Quality Photos
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop up to 5 photos or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={images.length >= 5}
          >
            <Plus className="w-5 h-5 mr-2" />
            {images.length === 0 ? 'Select Photos' : 'Add More Photos'}
          </Button>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={image.preview}
                    alt={`Coin ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  {image.uploaded && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 bg-white rounded-full" />
                    </div>
                  )}
                  {image.error && (
                    <div className="absolute top-2 right-2">
                      <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </Button>
                {image.error && (
                  <p className="text-xs text-red-500 mt-1 truncate">{image.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload and Analyze Button */}
        {images.length > 0 && !images.every(img => img.uploaded) && (
          <Button
            onClick={onUploadAndAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Images...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Upload & Analyze Photos
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;
