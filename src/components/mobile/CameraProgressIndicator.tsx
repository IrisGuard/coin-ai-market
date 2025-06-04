
interface CameraProgressIndicatorProps {
  currentStep: 'front' | 'back' | 'error' | 'complete';
  coinType: 'normal' | 'error';
  capturedImagesCount: number;
}

const CameraProgressIndicator = ({ currentStep, coinType, capturedImagesCount }: CameraProgressIndicatorProps) => {
  const steps = ['front', 'back', ...(coinType === 'error' ? ['error'] : [])];

  return (
    <div className="flex items-center justify-center space-x-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`w-3 h-3 rounded-full ${
            capturedImagesCount > index ? 'bg-green-500' : 
            currentStep === step ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default CameraProgressIndicator;
