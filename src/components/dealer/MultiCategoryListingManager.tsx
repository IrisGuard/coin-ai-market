import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Package, DollarSign, Clock, Target } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MultiCategoryListingManager = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    price: '',
    auction_duration: '7',
    buy_now_price: '',
    shipping_cost: '',
    international_shipping: false
  });

  const categories = [
    { id: 'error_coins', name: 'Error Coins', icon: '⚠️' },
    { id: 'morgan_dollars', name: 'Morgan Silver Dollars', icon: '🪙' },
    { id: 'peace_dollars', name: 'Peace Dollars', icon: '🕊️' },
    { id: 'walking_liberty', name: 'Walking Liberty Half Dollars', icon: '🚶‍♀️' },
    { id: 'mercury_dimes', name: 'Mercury Dimes', icon: '☿️' },
    { id: 'indian_head_cents', name: 'Indian Head Cents', icon: '🪶' },
    { id: 'wheat_pennies', name: 'Wheat Pennies', icon: '🌾' },
    { id: 'buffalo_nickels', name: 'Buffalo Nickels', icon: '🦬' },
    { id: 'franklin_halves', name: 'Franklin Half Dollars', icon: '⚡' },
    { id: 'kennedy_halves', name: 'Kennedy Half Dollars', icon: '🎯' },
    { id: 'eisenhower_dollars', name: 'Eisenhower Dollars', icon: '⭐' },
    { id: 'susan_b_anthony', name: 'Susan B. Anthony Dollars', icon: '👩‍⚖️' },
    { id: 'american_eagles', name: 'American Silver Eagles', icon: '🦅' },
    { id: 'commemoratives', name: 'Commemorative Coins', icon: '🏆' },
    { id: 'proof_sets', name: 'Proof Sets', icon: '💎' }
  ];

  const createMultiListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const listings = [];
      
      for (const categoryId of selectedCategories) {
        const category = categories.find(c => c.id === categoryId);
        
        const listingPayload = {
          listing_type: data.auction_duration ? 'auction' : 'fixed_price',
          starting_price: parseFloat(data.price),
          buyout_price: data.buy_now_price ? parseFloat(data.buy_now_price) : null,
          shipping_cost: parseFloat(data.shipping_cost || '0'),
          international_shipping: data.international_shipping,
          ends_at: data.auction_duration 
            ? new Date(Date.now() + (parseInt(data.auction_duration) * 24 * 60 * 60 * 1000)).toISOString()
            : null,
          status: 'active',
          category_name: category?.name,
          category_id: categoryId
        };
        
        const { data: listing, error } = await supabase
          .from('marketplace_listings')
          .insert(listingPayload)
          .select()
          .single();
          
        if (error) throw error;
        listings.push(listing);
      }
      
      return listings;
    },
    onSuccess: (listings) => {
      toast({
        title: "Success!",
        description: `Created ${listings.length} listings across multiple categories`,
      });
      
      // Reset form
      setSelectedCategories([]);
      setListingData({
        title: '',
        description: '',
        price: '',
        auction_duration: '7',
        buy_now_price: '',
        shipping_cost: '',
        international_shipping: false
      });
    }
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreateMultiListing = () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive"
      });
      return;
    }
    
    if (!listingData.title || !listingData.price) {
      toast({
        title: "Error",
        description: "Please fill in title and price",
        variant: "destructive"
      });
      return;
    }
    
    createMultiListingMutation.mutate(listingData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600" />
            Multi-Category Listing Manager
            <Badge className="bg-green-100 text-green-800">Commercial Features</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Listing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={listingData.title}
                  onChange={(e) => setListingData({...listingData, title: e.target.value})}
                  placeholder="1921 Morgan Silver Dollar MS-63"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Starting Price / Buy Now Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={listingData.price}
                  onChange={(e) => setListingData({...listingData, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Auction Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Auction Duration (days)</label>
                <Select 
                  value={listingData.auction_duration} 
                  onValueChange={(value) => setListingData({...listingData, auction_duration: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Fixed Price Only</SelectItem>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Buy Now Price (Optional)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={listingData.buy_now_price}
                  onChange={(e) => setListingData({...listingData, buy_now_price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Shipping Cost</label>
                <Input
                  type="number"
                  step="0.01"
                  value={listingData.shipping_cost}
                  onChange={(e) => setListingData({...listingData, shipping_cost: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* International Shipping */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="international"
                checked={listingData.international_shipping}
                onCheckedChange={(checked) => 
                  setListingData({...listingData, international_shipping: !!checked})
                }
              />
              <label htmlFor="international" className="text-sm font-medium">
                Enable International Shipping
              </label>
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Categories ({selectedCategories.length} selected)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCategories.includes(category.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                        />
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{category.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary and Action */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-medium">Listing Summary</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCategories.length} categories selected • 
                    {listingData.auction_duration === '0' ? ' Fixed Price' : ` ${listingData.auction_duration} day auction`} • 
                    ${listingData.price || '0.00'} starting price
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={handleCreateMultiListing}
                    disabled={createMultiListingMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {createMultiListingMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        Create Multi-Listing
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{selectedCategories.length}</div>
            <p className="text-xs text-muted-foreground">Categories Selected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              ${listingData.price ? (parseFloat(listingData.price) * selectedCategories.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Total Potential Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {listingData.auction_duration === '0' ? 'Fixed' : `${listingData.auction_duration}d`}
            </div>
            <p className="text-xs text-muted-foreground">Listing Duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {listingData.international_shipping ? 'Global' : 'Domestic'}
            </div>
            <p className="text-xs text-muted-foreground">Shipping Scope</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiCategoryListingManager;
