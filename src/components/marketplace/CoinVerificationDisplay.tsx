
import React from 'react';
import VerifiedStoreBadge from '@/components/admin/enhanced/VerifiedStoreBadge';
import { useVerifiedStoreStatus } from '@/hooks/useVerifiedStoreStatus';

interface CoinVerificationDisplayProps {
  storeId?: string;
  storeName?: string;
  size?: 'sm' | 'md' | 'lg';
  showStoreName?: boolean;
}

const CoinVerificationDisplay: React.FC<CoinVerificationDisplayProps> = ({
  storeId,
  storeName,
  size = 'sm',
  showStoreName = false
}) => {
  const { data: isVerified } = useVerifiedStoreStatus(storeId);

  if (!isVerified) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <VerifiedStoreBadge isVerified={isVerified} size={size} />
      {showStoreName && storeName && (
        <span className="text-sm text-gray-600">
          by {storeName}
        </span>
      )}
    </div>
  );
};

export default CoinVerificationDisplay;
