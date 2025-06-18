
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface VerifiedStoreBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const VerifiedStoreBadge: React.FC<VerifiedStoreBadgeProps> = ({ 
  isVerified, 
  size = 'sm',
  showIcon = true 
}) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`bg-green-100 text-green-800 border-green-300 ${sizeClasses[size]} flex items-center gap-1`}
    >
      {showIcon && <CheckCircle className={iconSizes[size]} />}
      Verified Store
    </Badge>
  );
};

export default VerifiedStoreBadge;
