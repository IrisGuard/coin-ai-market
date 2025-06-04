
import { AlertCircle } from 'lucide-react';

interface CameraOfflineStatusProps {
  isOnline: boolean;
}

const CameraOfflineStatus = ({ isOnline }: CameraOfflineStatusProps) => {
  if (isOnline) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <div className="flex items-center gap-2 text-orange-700">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Offline Mode</span>
      </div>
      <p className="text-xs text-orange-600 mt-1">
        Photos will sync automatically when connection returns
      </p>
    </div>
  );
};

export default CameraOfflineStatus;
