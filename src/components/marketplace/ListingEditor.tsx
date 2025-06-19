
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ListingEditorProps {
  listing?: any;
  coinId?: string;
  onClose: () => void;
}

const ListingEditor: React.FC<ListingEditorProps> = ({ listing, coinId, onClose }) => {
  const { createListing, updateListing, isCreating, isUpdating } = useMarketplace();
  const [formData, setFormData] = useState({
    listing_type: listing?.listing_type || 'fixed_price',
    starting_price: listing?.starting_price || '',
    buyout_price: listing?.buyout_price || '',
    auction_duration: listing?.auction_duration || 7,
    description: listing?.description || '',
    shipping_cost: listing?.shipping_cost || 0,
    international_shipping: listing?.international_shipping || false,
    return_policy: listing?.return_policy || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      starting_price: Number(formData.starting_price),
      buyout_price: formData.buyout_price ? Number(formData.buyout_price) : undefined,
      shipping_cost: Number(formData.shipping_cost)
    };

    if (listing) {
      updateListing({ id: listing.id, updates: data });
    } else if (coinId) {
      createListing({ ...data, coin_id: coinId });
    }
    
    onClose();
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {listing ? 'Edit Listing' : 'Create New Listing'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="listing_type">Listing Type</Label>
                <Select value={formData.listing_type} onValueChange={(value) => updateField('listing_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed_price">Fixed Price</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                    <SelectItem value="best_offer">Best Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="starting_price">
                    {formData.listing_type === 'auction' ? 'Starting Bid' : 'Price'} ($)
                  </Label>
                  <Input
                    id="starting_price"
                    type="number"
                    step="0.01"
                    value={formData.starting_price}
                    onChange={(e) => updateField('starting_price', e.target.value)}
                    required
                  />
                </div>

                {formData.listing_type === 'auction' && (
                  <div>
                    <Label htmlFor="buyout_price">Buy It Now Price ($)</Label>
                    <Input
                      id="buyout_price"
                      type="number"
                      step="0.01"
                      value={formData.buyout_price}
                      onChange={(e) => updateField('buyout_price', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {formData.listing_type === 'auction' && (
                <div>
                  <Label htmlFor="auction_duration">Auction Duration (days)</Label>
                  <Select value={formData.auction_duration.toString()} onValueChange={(value) => updateField('auction_duration', Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="10">10 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description & Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your coin, its condition, and any notable features..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="return_policy">Return Policy</Label>
                <Textarea
                  id="return_policy"
                  value={formData.return_policy}
                  onChange={(e) => updateField('return_policy', e.target.value)}
                  placeholder="Describe your return policy..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping_cost">Shipping Cost ($)</Label>
                <Input
                  id="shipping_cost"
                  type="number"
                  step="0.01"
                  value={formData.shipping_cost}
                  onChange={(e) => updateField('shipping_cost', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="international_shipping"
                  checked={formData.international_shipping}
                  onCheckedChange={(checked) => updateField('international_shipping', checked)}
                />
                <Label htmlFor="international_shipping">International Shipping Available</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : (listing ? 'Update Listing' : 'Create Listing')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListingEditor;
