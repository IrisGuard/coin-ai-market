
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Globe, DollarSign, Clock, Package, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MultiCategoryListingManager = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    basePrice: '',
    shippingCost: '',
    internationalShipping: false,
    returnPolicy: '30-day return',
    listingType: 'buy_now'
  });

  const queryClient = useQueryClient();

  const categories = [
    { id: 'us_coins', name: 'US Coins', icon: '🇺🇸', fee: '3.5%' },
    { id: 'world_coins', name: 'World Coins', icon: '🌍', fee: '4.0%' },
    { id: 'ancient_coins', name: 'Ancient Coins', icon: '🏛️', fee: '5.0%' },
    { id: 'error_coins', name: 'Error Coins', icon: '⚠️', fee: '6.0%' },
    { id: 'precious_metals', name: 'Precious Metals', icon: '🥇', fee: '2.5%' },
    { id: 'paper_money', name: 'Paper Money', icon: '💵', fee: '3.0%' },
    { id: 'tokens_medals', name: 'Tokens & Medals', icon: '🏅', fee: '4.5%' },
    { id: 'commemoratives', name: 'Commemoratives', icon: '🎖️', fee: '3.5%' },
    { id: 'proof_sets', name: 'Proof Sets', icon: '📦', fee: '3.0%' },
    { id: 'mint_sets', name: 'Mint Sets', icon: '🏭', fee: '3.0%' },
    { id: 'bullion', name: 'Bullion', icon: '🔸', fee: '2.0%' },
    { id: 'collectibles', name: 'Collectibles', icon: '💎', fee: '5.0%' }
  ];

  const createMultiListingMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('🚀 REAL Multi-category listing creation...', { categories: selectedCategories.length });
      
      // REAL Create multiple listings in database
      const listings = selectedCategories.map(categoryId => {
        const category = categories.find(c => c.id === categoryId);
        return {
          coin_id: null, // Will be filled when coin is created
          seller_id: data.user_id,
          listing_type: data.listingType,
          starting_price: parseFloat(data.basePrice),
          current_price: parseFloat(data.basePrice),
          shipping_cost: parseFloat(data.shippingCost || '0'),
          international_shipping: data.internationalShipping,
          return_policy: data.returnPolicy,
          status: 'active',
          created_at: new Date().toISOString(),
          category_name: category?.name,
          category_icon: category?.icon,
          marketplace_fee: category?.fee
        };
      });

      const { data: createdListings, error } = await supabase
        .from('marketplace_listings')
        .insert(listings)
        .select();

      if (error) {
        console.error('❌ Multi-listing creation failed:', error);
        throw error;
      }

      console.log('✅ REAL Multi-category listings created:', createdListings.length);
      return createdListings;
    },
    onSuccess: (data) => {
      console.log('✅ Multi-category listing success:', data);
      toast({
        title: "🚀 REAL Multi-Category Listing Created!",
        description: `Successfully created ${data.length} REAL listings across selected categories`,
      });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      
      // Reset form
      setSelectedCategories([]);
      setListingData({
        title: '',
        description: '',
        basePrice: '',
        shippingCost: '',
        internationalShipping: false,
        returnPolicy: '30-day return',
        listingType: 'buy_now'
      });
    },
    onError: (error: any) => {
      console.error('❌ Multi-listing error:', error);
      toast({
        title: "❌ Multi-Listing Failed",
        description: error.message || "Failed to create multi-category listings",
        variant: "destructive"
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

  const calculateTotalFees = () => {
    return selectedCategories.reduce((total, categoryId) => {
      const category = categories.find(c => c.id === categoryId);
      const feePercent = parseFloat(category?.fee.replace('%', '') || '0');
      const basePrice = parseFloat(listingData.basePrice || '0');
      return total + (basePrice * feePercent / 100);
    }, 0);
  };

  const handleCreateListings = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "No Categories Selected",
        description: "Please select at least one category for your listing",
        variant: "destructive"
      });
      return;
    }

    if (!listingData.title || !listingData.basePrice) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in title and base price",
        variant: "destructive"
      });
      return;
    }

    console.log('🎯 Creating REAL multi-category listings...', {
      categories: selectedCategories,
      data: listingData
    });

    // Get current user
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create listings",
        variant: "destructive"
      });
      return;
    }

    createMultiListingMutation.mutate({
      ...listingData,
      user_id: user.user.id
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            REAL Multi-Category Listing Manager
            <Badge className="bg-green-100 text-green-800">
              {selectedCategories.length} Selected
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              REAL DATABASE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Category Selection Grid */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select Target Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={selectedCategories.includes(category.id)}
                      />
                      <span className="text-xl">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-muted-foreground">Fee: {category.fee}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL Listing Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={listingData.title}
                    onChange={(e) => setListingData({...listingData, title: e.target.value})}
                    placeholder="1921 Morgan Silver Dollar MS-63"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Base Price * ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={listingData.basePrice}
                    onChange={(e) => setListingData({...listingData, basePrice: e.target.value})}
                    placeholder="125.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Listing Type</label>
                  <Select 
                    value={listingData.listingType}
                    onValueChange={(value) => setListingData({...listingData, listingType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy_now">Buy Now</SelectItem>
                      <SelectItem value="auction">Auction</SelectItem>
                      <SelectItem value="both">Buy Now + Auction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Shipping Cost ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={listingData.shippingCost}
                    onChange={(e) => setListingData({...listingData, shippingCost: e.target.value})}
                    placeholder="5.95"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Return Policy</label>
                  <Select 
                    value={listingData.returnPolicy}
                    onValueChange={(value) => setListingData({...listingData, returnPolicy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_returns">No Returns</SelectItem>
                      <SelectItem value="30-day return">30-Day Return</SelectItem>
                      <SelectItem value="60-day return">60-Day Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={listingData.internationalShipping}
                    onCheckedChange={(checked) => 
                      setListingData({...listingData, internationalShipping: checked as boolean})
                    }
                  />
                  <label className="text-sm font-medium">International Shipping</label>
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* REAL Fee Summary */}
            {selectedCategories.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  REAL Fee Summary
                </h4>
                <div className="space-y-1 text-sm">
                  {selectedCategories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    const basePrice = parseFloat(listingData.basePrice || '0');
                    const feePercent = parseFloat(category?.fee.replace('%', '') || '0');
                    const fee = basePrice * feePercent / 100;
                    
                    return (
                      <div key={categoryId} className="flex justify-between">
                        <span>{category?.name}</span>
                        <span>${fee.toFixed(2)} ({category?.fee})</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-1 font-medium flex justify-between">
                    <span>Total Fees:</span>
                    <span>${calculateTotalFees().toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    * Fees will be charged to REAL marketplace listings
                  </div>
                </div>
              </div>
            )}

            {/* REAL Action Button */}
            <Button
              onClick={handleCreateListings}
              disabled={selectedCategories.length === 0 || createMultiListingMutation.isPending || !listingData.title || !listingData.basePrice}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {createMultiListingMutation.isPending ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Creating REAL Listings...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Create {selectedCategories.length} REAL Multi-Category Listings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiCategoryListingManager;
