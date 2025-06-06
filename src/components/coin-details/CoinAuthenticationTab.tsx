
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface CoinAuthenticationTabProps {
  coin: {
    authentication_status?: string;
    pcgs_number?: string;
    ngc_number?: string;
  };
}

const CoinAuthenticationTab = ({ coin }: CoinAuthenticationTabProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold">Authentication Status</div>
              <Badge className={`mt-1 ${
                coin.authentication_status === 'verified' ? 'bg-green-600 text-white' :
                coin.authentication_status === 'rejected' ? 'bg-red-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {coin.authentication_status === 'verified' ? 'Verified Authentic' :
                 coin.authentication_status === 'rejected' ? 'Authentication Failed' :
                 'Pending Authentication'}
              </Badge>
            </div>
          </div>
          
          {coin.pcgs_number && (
            <div>
              <span className="text-sm text-gray-600">PCGS Number</span>
              <div className="font-semibold">{coin.pcgs_number}</div>
            </div>
          )}
          
          {coin.ngc_number && (
            <div>
              <span className="text-sm text-gray-600">NGC Number</span>
              <div className="font-semibold">{coin.ngc_number}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinAuthenticationTab;
