
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, X, RotateCw, Plus, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageEditor } from '@/hooks/useImageEditor';

interface CoinImageEditorProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated?: (newImages: string[]) => void;
  maxImages?: number;
}

const CoinImageEditor: React.FC<CoinImageEditorProps> = ({
  coinId,
  coinName,
  currentImages,
  onImagesUpdated,
  maxImages = 10
}) => {
  const { 
    isLoading,
    handleDeleteImage,
    handleReplaceImage,
    handleAddImage
  } = useImageEditor({ coinId, coinName, currentImages, onImagesUpdated });

  const handleFileSelect = (files: FileList | null, targetIndex?: number) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (targetIndex !== undefined) {
      handleReplaceImage(file, targetIndex);
    } else {
      handleAddImage(file);
    }
  };

  const validImages = currentImages.filter(img => img && !img.startsWith('blob:'));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Images</span>
          <Badge variant="outline">{validImages.length}/{maxImages}</Badge>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence>
          {validImages.map((imageUrl, index) => (
            <motion.div
              key={`${imageUrl}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50"
            >
              <img
                src={imageUrl}
                alt={`${coinName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {/* Replace Image */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files, index)}
                    className="hidden"
                    id={`replace-${index}`}
                    disabled={isLoading}
                  />
                  <label htmlFor={`replace-${index}`}>
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <span>
                        {isLoading ? (
                          <RotateCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                  </label>

                  {/* Delete Image */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteImage(imageUrl, index)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Image Index */}
              <Badge className="absolute top-2 left-2 text-xs">
                {index + 1}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Image Button */}
        {validImages.length < maxImages && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="add-new-image"
              disabled={isLoading}
            />
            <label htmlFor="add-new-image" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2 p-4">
                {isLoading ? (
                  <RotateCw className="w-8 h-8 text-gray-400 animate-spin" />
                ) : (
                  <Plus className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm text-gray-500 text-center">
                  Add Image
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Hover over images to edit • Click upload to replace • Click X to delete • Changes save automatically
        </p>
      </div>
    </div>
  );
};

export default CoinImageEditor;
