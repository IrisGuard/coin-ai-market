
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, RotateCw, Zap, Eye, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDualImageAnalysis } from '@/hooks/useDualImageAnalysis';
import type { DualImageAnalysisResult } from '@/hooks/useDualImageAnalysis';

interface DualImageUploaderProps {
  onAnalysisComplete?: (result: DualImageAnalysisResult) => void;
}

const DualImageUploader: React.FC<DualImageUploaderProps> = ({ onAnalysisComplete }) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [draggedOver, setDraggedOver] = useState<'front' | 'back' | null>(null);

  const { performDualAnalysis, isAnalyzing, analysisProgress, currentStep } = useDualImageAnalysis();

  const handleImageSelect = useCallback((file: File, side: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(preview);
      } else {
        setBackImage(file);
        setBackPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    setDraggedOver(null);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file, side);
    }
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    setDraggedOver(side);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOver(null);
  }, []);

  const handleAnalyze = async () => {
    if (!frontImage || !backImage) {
      return;
    }

    const result = await performDualAnalysis(frontImage, backImage);
    if (result && onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };

  const canAnalyze = frontImage && backImage && !isAnalyzing;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
            <Camera className="h-6 w-6 text-purple-600" />
          </div>
          Complete Dual-Side Coin Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          Upload both sides of your coin for comprehensive AI analysis and global market discovery
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Side */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Front Side (Obverse)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                draggedOver === 'front' 
                  ? 'border-blue-500 bg-blue-50' 
                  : frontImage
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={(e) => handleDrop(e, 'front')}
              onDragOver={(e) => handleDragOver(e, 'front')}
              onDragLeave={handleDragLeave}
            >
              {frontPreview ? (
                <div className="space-y-3">
                  <img 
                    src={frontPreview} 
                    alt="Front side preview" 
                    className="max-w-full h-32 object-contain mx-auto rounded-lg shadow-md"
                  />
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Front side ready</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Drop front image or click to upload</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(file, 'front');
                }}
                className="hidden"
                id="front-upload"
              />
              <label htmlFor="front-upload">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 cursor-pointer"
                  asChild
                >
                  <span>Choose Front Image</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              Back Side (Reverse)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                draggedOver === 'back' 
                  ? 'border-purple-500 bg-purple-50' 
                  : backImage
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={(e) => handleDrop(e, 'back')}
              onDragOver={(e) => handleDragOver(e, 'back')}
              onDragLeave={handleDragLeave}
            >
              {backPreview ? (
                <div className="space-y-3">
                  <img 
                    src={backPreview} 
                    alt="Back side preview" 
                    className="max-w-full h-32 object-contain mx-auto rounded-lg shadow-md"
                  />
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Back side ready</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <RotateCw className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Drop back image or click to upload</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(file, 'back');
                }}
                className="hidden"
                id="back-upload"
              />
              <label htmlFor="back-upload">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 cursor-pointer"
                  asChild
                >
                  <span>Choose Back Image</span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium">AI Analysis in Progress</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentStep}</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className={`flex items-center gap-1 ${analysisProgress > 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  AI Recognition
                </div>
                <div className={`flex items-center gap-1 ${analysisProgress > 50 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Web Discovery
                </div>
                <div className={`flex items-center gap-1 ${analysisProgress > 70 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 70 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Visual Matching
                </div>
                <div className={`flex items-center gap-1 ${analysisProgress > 85 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${analysisProgress > 85 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Market Analysis
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Zap className="h-5 w-5 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Start Complete Analysis
            </>
          )}
        </Button>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-600">
              <div className="font-medium">Dual-Side Analysis</div>
              <div>Both obverse & reverse</div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-xs text-gray-600">
              <div className="font-medium">Global Discovery</div>
              <div>eBay, Heritage, PCGS</div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-xs text-gray-600">
              <div className="font-medium">Error Detection</div>
              <div>Advanced pattern matching</div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <RotateCw className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-xs text-gray-600">
              <div className="font-medium">Market Analysis</div>
              <div>Real-time pricing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DualImageUploader;
