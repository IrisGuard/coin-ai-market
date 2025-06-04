
interface CameraSquareGuideProps {
  showSquareGuide: boolean;
}

const CameraSquareGuide = ({ showSquareGuide }: CameraSquareGuideProps) => {
  if (!showSquareGuide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-80 h-80 border-4 border-white border-dashed rounded-lg">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-sm">Keep coin within the square</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSquareGuide;
