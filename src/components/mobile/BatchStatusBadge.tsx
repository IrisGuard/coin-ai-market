
import { Badge } from '@/components/ui/badge';
import { CoinBatch } from '@/types/batch';

interface BatchStatusBadgeProps {
  status: CoinBatch['status'];
}

const BatchStatusBadge = ({ status }: BatchStatusBadgeProps) => {
  const getStatusColor = (status: CoinBatch['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

export default BatchStatusBadge;
