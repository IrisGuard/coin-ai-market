
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Shield, Star } from 'lucide-react';

interface CoinSellerInfoProps {
  seller: {
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
    verified_dealer?: boolean;
    created_at?: string;
    rating?: number;
  };
  coinCreatedAt: string;
}

const CoinSellerInfo = ({ seller, coinCreatedAt }: CoinSellerInfoProps) => {
  const sellerName = seller?.full_name || seller?.name || seller?.username || 'Unknown Seller';

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Seller Information
        </h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={seller?.avatar_url} />
            <AvatarFallback>{sellerName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{sellerName}</span>
              {seller?.verified_dealer && (
                <Badge className="bg-blue-600 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Member since {new Date(seller?.created_at || coinCreatedAt).getFullYear()}</span>
              {seller?.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                    {Number(seller.rating).toFixed(1)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinSellerInfo;
