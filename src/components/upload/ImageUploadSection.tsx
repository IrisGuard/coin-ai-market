
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, UploadIcon, Zap, Loader2 } from 'lucide-react';

interface ImageUploadSectionProps {
  uploadedImage: string;
  isAnalyzing: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
}

const ImageUploadSection = ({
  uploadedImage,
  isAnalyzing,
  onImageUpload,
  onClearImage
}: ImageUploadSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Card className="glass-card border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-purple-600" />
            Upload Coin Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center bg-gradient-to-br from-purple-50 to-blue-50">
                <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Take or Upload Photo
                </h3>
                <p className="text-gray-600 mb-6">
                  Capture both sides of your coin for best results
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  id="coin-upload"
                />
                <label htmlFor="coin-upload">
                  <Button className="coinvision-button cursor-pointer">
                    <UploadIcon className="w-5 h-5 mr-2" />
                    Choose Image
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`relative rounded-2xl overflow-hidden ${isAnalyzing ? 'ai-scanning' : ''}`}>
                  <img
                    src={uploadedImage}
                    alt="Uploaded coin"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="font-semibold text-purple-600">Analyzing with AI...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={onClearImage}
                  className="w-full"
                >
                  Upload Different Image
                </Button>
              </div>
            )}

            {/* AI Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Photography Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use good lighting, avoid shadows</li>
                <li>• Keep camera steady and focused</li>
                <li>• Capture the entire coin clearly</li>
                <li>• Take photos of both sides if possible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImageUploadSection;
