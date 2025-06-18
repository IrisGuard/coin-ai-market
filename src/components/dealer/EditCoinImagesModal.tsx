
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, X, RotateCw, Plus, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoinImageManagement } from '@/hooks/useCoinImageManagement';

interface EditCoinImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinId: string;
  coinName: string;
  currentImages: string[];
}

const EditCoinImagesModal: React.FC<EditCoinImagesModalProps> = ({
  isOpen,
  onClose,
  coinId,
  coinName,
  currentImages
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  
  const { 
    isLoading, 
    isUpdating,
    deleteImageFromCoin, 
    replaceImageInCoin, 
    addNewImageToCoin 
  } = useCoinImageManagement({ coinId, currentImages });

  const handleFileSelect = useCallback((files: FileList | null, targetIndex?: number) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (targetIndex !== undefined) {
      // Replace existing image
      replaceImageInCoin(file, targetIndex);
      setReplacingIndex(null);
    } else {
      // Add new image
      addNewImageToCoin(file);
    }
  }, [replaceImageInCoin, addNewImageToCoin]);

  const handleDeleteImage = useCallback(async (imageUrl: string, index: number) => {
    await deleteImageFromCoin(imageUrl, index);
  }, [deleteImageFromCoin]);

  const validImages = currentImages.filter(img => img && !img.startsWith('blob:'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Edit Images - {coinName}
            <Badge variant="outline">{validImages.length}/10</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                        disabled={isLoading || isUpdating}
                      />
                      <label htmlFor={`replace-${index}`}>
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          disabled={isLoading || isUpdating}
                        >
                          <span>
                            {isLoading && replacingIndex === index ? (
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
                            disabled={isLoading || isUpdating}
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
                              disabled={isLoading || isUpdating}
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
            {validImages.length < 10 && (
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="add-new-image"
                  disabled={isLoading || isUpdating}
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to edit images:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click the upload icon to replace an image</li>
              <li>• Click the X button to delete an image</li>
              <li>• Click "Add Image" to add new images (max 10 total)</li>
              <li>• Changes are saved automatically</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isUpdating}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCoinImagesModal;
