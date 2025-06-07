
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const MobileCoinUploadForm = () => {
  const {
    images,
    isAnalyzing,
    analysisResults,
    isSubmitting,
    coinData,
    handleFiles,
    handleUploadAndAnalyze,
    handleSubmitListing,
    removeImage,
    handleCoinDataChange
  } = useCoinUpload();

  const [cameraMode, setCameraMode] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(e);
    setCameraMode(false);
  };

  const updateCoinData = (updates: Partial<typeof coinData>) => {
    handleCoinDataChange({ ...coinData, ...updates });
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Image Capture Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Capture Coin Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleCameraCapture}
                  className="hidden"
                  id="camera-input"
                />
                <Label htmlFor="camera-input">
                  <Button asChild className="w-full">
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </span>
                  </Button>
                </Label>
              </div>
              
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="gallery-input"
                />
                <Label htmlFor="gallery-input">
                  <Button variant="outline" asChild className="w-full">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Gallery
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Coin ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {image.uploaded && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute bottom-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Analysis Button */}
            {images.length > 0 && (
              <Button
                onClick={handleUploadAndAnalyze}
                disabled={isAnalyzing || images.every(img => img.uploaded)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">AI Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Coin:</span>
                  <p>{analysisResults.coinName}</p>
                </div>
                <div>
                  <span className="font-medium">Year:</span>
                  <p>{analysisResults.year}</p>
                </div>
                <div>
                  <span className="font-medium">Grade:</span>
                  <p>{analysisResults.grade}</p>
                </div>
                <div>
                  <span className="font-medium">Value:</span>
                  <p>{analysisResults.estimatedValue}</p>
                </div>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                Confidence: {Math.round(analysisResults.confidence * 100)}%
              </Badge>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Listing Details Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={coinData.title}
                onChange={(e) => updateCoinData({ title: e.target.value })}
                placeholder="Enter coin title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={coinData.description}
                onChange={(e) => updateCoinData({ description: e.target.value })}
                placeholder="Describe your coin"
                className="h-24"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auction-mode">Auction Mode</Label>
              <Switch
                id="auction-mode"
                checked={coinData.isAuction}
                onCheckedChange={(checked) => updateCoinData({ isAuction: checked })}
              />
            </div>

            <div>
              <Label htmlFor="price">
                {coinData.isAuction ? 'Starting Bid *' : 'Price *'}
              </Label>
              <Input
                id="price"
                type="number"
                value={coinData.isAuction ? coinData.startingBid : coinData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (coinData.isAuction) {
                    updateCoinData({ startingBid: value });
                  } else {
                    updateCoinData({ price: value });
                  }
                }}
                placeholder="Enter amount in USD"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={coinData.year}
                  onChange={(e) => updateCoinData({ year: e.target.value })}
                  placeholder="e.g. 1921"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={coinData.grade}
                  onChange={(e) => updateCoinData({ grade: e.target.value })}
                  placeholder="e.g. MS-63"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmitListing}
              disabled={
                !coinData.title || 
                (!coinData.price && !coinData.isAuction) || 
                (!coinData.startingBid && coinData.isAuction) ||
                images.length === 0 || 
                !images.every(img => img.uploaded) ||
                isSubmitting
              }
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MobileCoinUploadForm;
