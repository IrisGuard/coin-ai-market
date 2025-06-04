
import { CheckCircle, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { CoinBatch } from '@/hooks/useBulkUpload';

interface BatchStatusIconProps {
  status: CoinBatch['status'];
}

const BatchStatusIcon = ({ status }: BatchStatusIconProps) => {
  switch (status) {
    case 'completed': 
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'failed': 
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case 'processing': 
      return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
    default: 
      return <Upload className="w-4 h-4 text-gray-400" />;
  }
};

export default BatchStatusIcon;
