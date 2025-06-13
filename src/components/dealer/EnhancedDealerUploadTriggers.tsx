
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Bot, Eye, Bell, CheckCircle, Zap, AlertTriangle, Camera } from 'lucide-react';
import { useConnectedSystemFlow } from '@/hooks/useConnectedSystemFlow';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const EnhancedDealerUploadTriggers = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [coinDetails, setCoinDetails] = useState({
    title: '',
    description: '',
    year: '',
    mint: '',
    errorType: ''
  });
  
  const {
    images,
    isAnalyzing,
    analysisResults,
    coinData,
    uploadProgress,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    removeImage,
    handleCoinDataChange
  } = useCoinUpload();

  const {
    flowStatus,
    isExecuting,
    triggerCompleteFlow,
    error
  } = useConnectedSystemFlow();

  // Calculate overall progress
  const getOverallProgress = () => {
    const steps = Object.values(flowStatus);
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  // Enhanced upload handler with complete system flow
  const handleEnhancedUpload = useCallback(async () => {
    if (!images.length) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: 'Please select at least one image to upload',
        timestamp: new Date(),
        status: 'error'
      }]);
      return;
    }

    if (!coinDetails.title.trim()) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: 'Please enter a coin title',
        timestamp: new Date(),
        status: 'error'
      }]);
      return;
    }
    
    // Convert image objects to File objects
    const fileArray = images.map(img => img.file).filter(Boolean) as File[];
    
    if (fileArray.length === 0) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: 'No valid files found for upload',
        timestamp: new Date(),
        status: 'error'
      }]);
      return;
    }

    // Merge coin details with coin data
    const enhancedCoinData = {
      ...coinData,
      ...coinDetails
    };

    // Add start notification
    setNotifications(prev => [...prev, {
      type: 'flow_started',
      message: 'Starting dealer upload: Image Upload → AI Analysis → Visual Match → Market Research → Listing',
      timestamp: new Date(),
      status: 'info'
    }]);

    // Trigger the complete connected flow
    triggerCompleteFlow(fileArray, enhancedCoinData);
  }, [images, coinData, coinDetails, triggerCompleteFlow]);

  // Add real-time flow notifications
  React.useEffect(() => {
    if (flowStatus.upload && !flowStatus.analysis) {
      setNotifications(prev => [...prev, {
        type: 'upload_complete',
        message: 'Images uploaded successfully, starting AI analysis...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.analysis && !flowStatus.visualMatch) {
      setNotifications(prev => [...prev, {
        type: 'analysis_complete',
        message: 'AI analysis complete, searching for visual matches...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.visualMatch && !flowStatus.marketResearch) {
      setNotifications(prev => [...prev, {
        type: 'visual_match_complete',
        message: 'Visual matching complete, conducting market research...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.marketResearch && !flowStatus.listing) {
      setNotifications(prev => [...prev, {
        type: 'market_research_complete',
        message: 'Market research complete, creating marketplace listing...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.listing) {
      setNotifications(prev => [...prev, {
        type: 'flow_complete',
        message: 'Complete dealer upload flow executed successfully! Coin is now listed.',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
  }, [flowStatus]);

  const updateCoinDetails = (field: string, value: string) => {
    setCoinDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-600" />
            Professional Coin Upload
            <Badge className="bg-blue-100 text-blue-800">Dealer Portal</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Coin Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Coin Title *</Label>
                <Input
                  id="title"
                  value={coinDetails.title}
                  onChange={(e) => updateCoinDetails('title', e.target.value)}
                  placeholder="e.g., 1921 Morgan Silver Dollar"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={coinDetails.year}
                  onChange={(e) => updateCoinDetails('year', e.target.value)}
                  placeholder="e.g., 1921"
                />
              </div>
              <div>
                <Label htmlFor="mint">Mint</Label>
                <Input
                  id="mint"
                  value={coinDetails.mint}
                  onChange={(e) => updateCoinDetails('mint', e.target.value)}
                  placeholder="e.g., San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="errorType">Error Type (if applicable)</Label>
                <Input
                  id="errorType"
                  value={coinDetails.errorType}
                  onChange={(e) => updateCoinDetails('errorType', e.target.value)}
                  placeholder="e.g., Double Die, Off-Center"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={coinDetails.description}
                onChange={(e) => updateCoinDetails('description', e.target.value)}
                placeholder="Describe the coin's condition, notable features, or historical significance..."
                rows={3}
              />
            </div>

            {/* Compact Upload Area */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Coin Images</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Camera className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-lg font-medium">Upload coin images</p>
                <p className="text-sm text-gray-500 mb-2">
                  You may upload up to 10 images (front, back, details)
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Supported formats: JPG, PNG, WebP | Max size: 10MB per image
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
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
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Uploaded Images ({images.length}/10)
                  </Label>
                  {images.length >= 10 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      Maximum reached
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.slice(0, 10).map((image, index) => (
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
                        onClick={() => removeImage(index)}
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

            {/* Flow Progress */}
            {isExecuting && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="font-medium">Processing Your Coin Upload</span>
                </div>
                <Progress value={getOverallProgress()} className="h-2" />
                <div className="grid grid-cols-5 gap-1 text-xs">
                  <div className={`text-center p-2 rounded ${flowStatus.upload ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Upload
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.analysis ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    AI Analysis
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.visualMatch ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Visual Match
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.marketResearch ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Market Research
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.listing ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Create Listing
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleEnhancedUpload}
              disabled={!images.length || !coinDetails.title.trim() || isAnalyzing || isExecuting || images.length > 10}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isExecuting ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Processing Upload...
                </>
              ) : isAnalyzing ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Upload & Analyze Coin
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.slice(-6).map((notification, index) => (
                <Alert key={index} className={
                  notification.status === 'error' ? 'border-red-200 bg-red-50' :
                  notification.status === 'success' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }>
                  <Bell className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span className="text-sm">{notification.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error.message || 'An error occurred during the upload process'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedDealerUploadTriggers;
