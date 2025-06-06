
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Eye, ShoppingCart, Trash2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoinData {
  id: string;
  name: string;
  year: number;
  image: string;
  price: number;
  rarity: string;
  condition: string;
  country: string;
  is_auction: boolean;
  auction_end: string | null;
  views: number;
  user_id: string;
}

interface WatchlistItemData {
  id: string;
  listing_id: string;
  created_at: string;
  price_alert_enabled: boolean;
  target_price: number | null;
  price_change_percentage: number | null;
  coin: CoinData;
}

interface WatchlistItemProps {
  item: WatchlistItemData;
  index: number;
  viewMode: 'grid' | 'list';
  priceAlerts: Record<string, { enabled: boolean; target: string }>;
  setPriceAlerts: React.Dispatch<React.SetStateAction<Record<string, { enabled: boolean; target: string }>>>;
  onRemove: (id: string) => void;
  onUpdateAlert: (id: string, enabled: boolean, target?: number) => void;
}

const WatchlistItem = ({
  item,
  index,
  viewMode,
  priceAlerts,
  setPriceAlerts,
  onRemove,
  onUpdateAlert
}: WatchlistItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          {viewMode === 'grid' ? (
            <>
              {/* Grid View */}
              <div className="relative mb-4">
                <Link to={`/coins/${item.listing_id}`}>
                  <img 
                    src={item.coin?.image} 
                    alt={item.coin?.name}
                    className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                </Link>
                
                {/* Auction Badge */}
                {item.coin?.is_auction && (
                  <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Auction
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Link to={`/coins/${item.listing_id}`}>
                    <h3 className="font-semibold hover:text-brand-primary transition-colors truncate">
                      {item.coin?.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{item.coin?.year} • {item.coin?.country}</p>
                </div>

                {/* Price Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <span className="text-lg font-bold">${item.coin?.price}</span>
                  </div>
                </div>

                {/* Price Alert Section */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`alert-${item.id}`} className="text-sm">Price Alert</Label>
                    <Switch
                      id={`alert-${item.id}`}
                      checked={priceAlerts[item.id]?.enabled || false}
                      onCheckedChange={(checked) => {
                        setPriceAlerts(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], enabled: checked }
                        }));
                        
                        if (checked && priceAlerts[item.id]?.target) {
                          onUpdateAlert(item.id, checked, parseFloat(priceAlerts[item.id].target));
                        } else {
                          onUpdateAlert(item.id, checked);
                        }
                      }}
                    />
                  </div>
                  
                  {priceAlerts[item.id]?.enabled && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Target price"
                        value={priceAlerts[item.id]?.target || ''}
                        onChange={(e) => setPriceAlerts(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], target: e.target.value }
                        }))}
                        className="text-sm"
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          const target = parseFloat(priceAlerts[item.id]?.target || '0');
                          if (target > 0) {
                            onUpdateAlert(item.id, true, target);
                          }
                        }}
                      >
                        Set
                      </Button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/coins/${item.listing_id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  
                  {!item.coin?.is_auction && (
                    <Button size="sm" className="flex-1">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* List View */}
              <div className="flex items-center gap-4">
                <Link to={`/coins/${item.listing_id}`}>
                  <img 
                    src={item.coin?.image} 
                    alt={item.coin?.name}
                    className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                </Link>
                
                <div className="flex-1">
                  <Link to={`/coins/${item.listing_id}`}>
                    <h3 className="font-semibold hover:text-brand-primary transition-colors">
                      {item.coin?.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{item.coin?.year} • {item.coin?.country}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.coin?.is_auction && (
                      <Badge variant="outline" className="text-xs">Auction</Badge>
                    )}
                    {priceAlerts[item.id]?.enabled && (
                      <Badge variant="outline" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        Alert On
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold">${item.coin?.price}</p>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/coins/${item.listing_id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  {!item.coin?.is_auction && (
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WatchlistItem;
