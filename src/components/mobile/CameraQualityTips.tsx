
interface CameraQualityTipsProps {
  coinType: 'normal' | 'error';
}

const CameraQualityTips = ({ coinType }: CameraQualityTipsProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">📸 Optimization Tips:</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Images are automatically compressed for faster upload</li>
        <li>• Works offline - uploads sync when connection returns</li>
        <li>• Use good lighting (natural light is best)</li>
        <li>• Keep camera steady and focused</li>
        <li>• Fill the square frame with the coin</li>
        {coinType === 'error' && (
          <li>• Capture error details from multiple angles</li>
        )}
      </ul>
    </div>
  );
};

export default CameraQualityTips;
