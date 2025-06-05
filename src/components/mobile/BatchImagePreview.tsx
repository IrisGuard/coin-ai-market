
import { CoinBatch } from '@/types/batch';

interface BatchImagePreviewProps {
  batch: CoinBatch;
}

const BatchImagePreview = ({ batch }: BatchImagePreviewProps) => {
  return (
    <div className="flex gap-2 mt-2">
      {batch.images.slice(0, 3).map((image, imgIndex) => (
        <img
          key={imgIndex}
          src={URL.createObjectURL(image)}
          alt={`Preview ${imgIndex + 1}`}
          className="w-12 h-12 object-cover rounded border"
        />
      ))}
      {batch.images.length > 3 && (
        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
          +{batch.images.length - 3}
        </div>
      )}
    </div>
  );
};

export default BatchImagePreview;
