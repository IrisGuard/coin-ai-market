
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, DollarSign, Star, Eye, Heart, MapPin } from 'lucide-react';
import { useUpdateCoinStatus, useToggleCoinFeature } from '@/hooks/admin/useAdminCoins';

interface CoinDetailsModalProps {
  coin: any;
  isOpen: boolean;
  onClose: () => void;
}

const CoinDetailsModal: React.FC<CoinDetailsModalProps> = ({ coin, isOpen, onClose }) => {
  const updateStatus = useUpdateCoinStatus();
  const toggleFeature = useToggleCoinFeature();

  if (!coin) return null;

  const handleStatusUpdate = (status: string) => {
    updateStatus.mutate({ coinId: coin.id, status });
  };

  const handleFeatureToggle = () => {
    toggleFeature.mutate({ coinId: coin.id, featured: !coin.featured });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {coin.name}
            {coin.featured && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {(coin.obverse_image || coin.reverse_image) && (
                  <div className="grid grid-cols-2 gap-2">
                    {coin.obverse_image && (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={coin.obverse_image} 
                          alt="Obverse"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {coin.reverse_image && (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={coin.reverse_image} 
                          alt="Reverse"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      coin.authentication_status === 'verified' ? 'default' :
                      coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {coin.authentication_status}
                  </Badge>
                  {coin.featured && (
                    <Badge variant="outline" className="text-yellow-600">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('verified')}
                    disabled={updateStatus.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updateStatus.isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updateStatus.isPending}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={coin.featured ? "destructive" : "default"}
                    onClick={handleFeatureToggle}
                    disabled={toggleFeature.isPending}
                  >
                    {coin.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Year:</span> {coin.year}
                  </div>
                  <div>
                    <span className="font-medium">Grade:</span> {coin.grade}
                  </div>
                  <div>
                    <span className="font-medium">Country:</span> {coin.country || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Mint:</span> {coin.mint || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Rarity:</span> {coin.rarity}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {coin.category || 'N/A'}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">€{coin.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{coin.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{coin.favorites || 0} favorites</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{coin.profiles?.name || 'Unknown'}</span>
                  {coin.profiles?.verified_dealer && (
                    <Badge variant="outline" className="text-green-600">
                      Verified Dealer
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {coin.profiles?.email || 'No email'}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Listed: {new Date(coin.created_at).toLocaleDateString()}</span>
                </div>
                {coin.updated_at !== coin.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updated: {new Date(coin.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {coin.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{coin.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinDetailsModal;
