
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, RotateCcw, Check, X, Wifi, WifiOff, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const steps = [
    "Position coin in center",
    "Ensure good lighting", 
    "Capture obverse (front)",
    "Capture reverse (back)",
    "Add detail shots (optional)"
  ];

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

      setCapturedImages(prevImages => [...prevImages, { file, preview }]);
      setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));

      toast({
        title: "Image Captured",
        description: "Image added to the queue.",
      });
    }, 'image/jpeg');
  }, [steps.length]);

  const removeImage = useCallback((index: number) => {
    setCapturedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  }, []);

  const clearAllImages = useCallback(() => {
    setCapturedImages([]);
    setCurrentStep(0);
  }, []);

  const handleImagesConfirmed = useCallback(() => {
    onImagesSelected(capturedImages);
    onComplete?.();
  }, [capturedImages, onImagesSelected, onComplete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-600" />
        )}
        <span className="text-sm">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
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
          <div className="space-y-2">
            <div className="text-sm font-medium">Progress: Step {currentStep + 1} of {steps.length}</div>
            <div className="text-sm text-gray-600">{steps[currentStep]}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white rounded-lg opacity-50" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={captureImage} size="lg" className="flex-1">
                  <Camera className="w-5 h-5 mr-2" />
                  Capture
                </Button>
                <Button 
                  onClick={() => setCameraFacing(prev => prev === 'user' ? 'environment' : 'user')}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                <Button onClick={stopCamera} variant="outline" size="lg">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Tip:</strong> {steps[currentStep]}
          </div>

          {capturedImages.length > 0 && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.preview} 
                      alt={`Captured ${index + 1}`}
                      className="w-full aspect-square object-cover rounded border"
                    />
                    <Button
                      onClick={() => removeImage(index)}
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {capturedImages.length > 0 && (
            <div className="flex gap-3">
              <Button 
                onClick={handleImagesConfirmed}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Use Images ({capturedImages.length})
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileCameraUploader;
