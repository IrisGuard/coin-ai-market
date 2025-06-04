
import { Camera as CameraIcon, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  currentStep: 'front' | 'back' | 'error' | 'complete';
  isLoading: boolean;
  isCompressing: boolean;
  capturedImagesCount: number;
  minRequiredPhotos: number;
  onTakePicture: (step: 'front' | 'back' | 'error' | 'complete') => void;
  onComplete: () => void;
  onReset: () => void;
}

const CameraControls = ({
  currentStep,
  isLoading,
  isCompressing,
  capturedImagesCount,
  minRequiredPhotos,
  onTakePicture,
  onComplete,
  onReset
}: CameraControlsProps) => {
  return (
    <div className="flex space-x-3">
      {currentStep !== 'complete' && (
        <Button
          onClick={() => onTakePicture(currentStep)}
          disabled={isLoading || isCompressing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
        >
          {isLoading || isCompressing ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              {isCompressing ? 'Compressing...' : 'Taking Photo...'}
            </>
          ) : (
            <>
              <CameraIcon className="w-6 h-6 mr-2" />
              Take {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Photo
            </>
          )}
        </Button>
      )}

      {capturedImagesCount >= minRequiredPhotos && (
        <Button
          onClick={onComplete}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Complete ({capturedImagesCount} photos)
        </Button>
      )}
      
      {capturedImagesCount > 0 && (
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </Button>
      )}
    </div>
  );
};

export default CameraControls;
