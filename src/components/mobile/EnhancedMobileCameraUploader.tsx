import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, RotateCcw, Check, X, Wifi, WifiOff, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { EnhancedOfflineItemData } from '@/types/offline';
import CameraSquareGuide from './CameraSquareGuide';
import CameraControls from './CameraControls';
import CameraProgressIndicator from './CameraProgressIndicator';
import CameraQualityTips from './CameraQualityTips';
import CapturedImagesGrid from './CapturedImagesGrid';
import OfflineStatusIndicator from './OfflineStatusIndicator';

interface EnhancedMobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
  onComplete?: () => void;
}

const EnhancedMobileCameraUploader = ({ 
  onImagesSelected, 
  maxImages = 10,
  onComplete 
}: EnhancedMobileCameraUploaderProps) => {
  const [isActive, setIsActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { queueOfflineItem, syncOfflineItems, offlineItems } = useOfflineSync();

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error: any) {
      console.error("Error starting camera:", error);
      toast({
        title: "Camera Error",
        description: error.message || "Failed to start camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [cameraFacing]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast({
          title: "Capture Error",
          description: "Failed to capture image.",
          variant: "destructive",
        });
        return;
      }

      const file = new File([blob], `coin_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(file);

      if (!isOnline) {
        await handleQueueOffline({ file, preview });
      } else {
        setCapturedImages(prevImages => [...prevImages, { file, preview }]);
        setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
      }

      toast({
        title: "Image Captured",
        description: "Image added to the queue.",
      });
    }, 'image/jpeg');
  }, [isOnline, handleQueueOffline, steps.length]);

  const removeImage = useCallback((index: number) => {
    setCapturedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  }, []);

  const retakeImage = useCallback((index: number) => {
    removeImage(index);
    setCurrentStep(index);
  }, [removeImage]);

  const clearAllImages = useCallback(() => {
    setCapturedImages([]);
    setCurrentStep(0);
  }, []);

  const handleImagesConfirmed = useCallback(() => {
    onImagesSelected(capturedImages);
    onComplete?.();
  }, [capturedImages, onImagesSelected, onComplete]);

  const handleQueueOffline = useCallback(async (imageData: { file: File; preview: string }) => {
    const offlineItem: EnhancedOfflineItemData = {
      timestamp: Date.now(),
      step: `coin-image-${capturedImages.length + 1}`,
      data: {
        imageData: imageData.preview,
        fileName: imageData.file.name,
        fileSize: imageData.file.size,
        captureTime: new Date().toISOString()
      },
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      retryCount: 0
    };

    await queueOfflineItem(offlineItem);
    
    toast({
      title: "Image Queued Offline",
      description: "Image saved locally and will sync when connection is restored.",
    });
  }, [capturedImages.length, queueOfflineItem]);

  const steps = [
    "Position coin in center",
    "Ensure good lighting", 
    "Capture obverse (front)",
    "Capture reverse (back)",
    "Add detail shots (optional)"
  ];

  return (
    <div className="space-y-4">
      <OfflineStatusIndicator isOnline={isOnline} />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Enhanced Coin Camera
            </CardTitle>
            <Badge variant="outline">
              {capturedImages.length}/{maxImages} Images
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CameraProgressIndicator 
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {!isActive ? (
            <div className="text-center space-y-4">
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              <Button 
                onClick={startCamera} 
                className="w-full"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <CameraSquareGuide />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <CameraControls
                onCapture={captureImage}
                onSwitchCamera={() => setCameraFacing(prev => prev === 'user' ? 'environment' : 'user')}
                onClose={stopCamera}
                isCapturing={false}
              />
            </div>
          )}

          <CameraQualityTips currentStep={currentStep} />

          {capturedImages.length > 0 && (
            <>
              <Separator />
              <CapturedImagesGrid
                images={capturedImages}
                onRemoveImage={removeImage}
                onRetakeImage={retakeImage}
              />
            </>
          )}

          {capturedImages.length > 0 && (
            <div className="flex gap-3">
              <Button 
                onClick={handleImagesConfirmed}
                className="flex-1"
                disabled={!isOnline && capturedImages.length === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                {isOnline ? 'Use Images' : 'Queue Offline'}
              </Button>
              
              <Button 
                onClick={clearAllImages}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}

          {!isOnline && offlineItems.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {offlineItems.length} items queued offline
                </span>
              </div>
              <Button 
                onClick={syncOfflineItems}
                size="sm"
                variant="outline"
                className="w-full"
                disabled={!isOnline}
              >
                <Upload className="w-4 h-4 mr-2" />
                Sync When Online
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileCameraUploader;
