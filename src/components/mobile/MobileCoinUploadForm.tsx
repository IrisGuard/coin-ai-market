
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Coins, Upload, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import EnhancedImageUploadZone from '@/components/upload/EnhancedImageUploadZone';
import type { CoinData, UploadedImage } from '@/types/upload';

const MobileCoinUploadForm = () => {
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    year: '',
    grade: '',
    price: '',
    rarity: 'Common',
    country: '',
    denomination: '',
    condition: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: '',
    category: 'modern',
    isAuction: false,
    startingBid: '',
    auctionDuration: '7'
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const { isSubmitting, submitListing } = useCoinSubmission();

  const handleSubmit = async () => {
    if (!coinData.title) {
      toast({
        title: "Title Required",
        description: "Please enter a coin title",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images Required", 
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    await submitListing(coinData, images);
  };

  const handleInputChange = (field: keyof CoinData, value: string | boolean) => {
    setCoinData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            Mobile Coin Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Image Upload Zone */}
          <EnhancedImageUploadZone
            onImagesUploaded={setImages}
            maxImages={10}
            title="Upload 1-10 Coin Images"
          />

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Coin Title *</Label>
              <Input
                id="title"
                value={coinData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., 1943 Double Die Penny Error"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={coinData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the coin..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={coinData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="1943"
                />
              </div>

              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={coinData.grade}
                  onValueChange={(value) => handleInputChange('grade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Fine">Fine</SelectItem>
                    <SelectItem value="Very Fine">Very Fine</SelectItem>
                    <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                    <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                    <SelectItem value="Uncirculated">Uncirculated</SelectItem>
                    <SelectItem value="Mint State">Mint State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={coinData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="United States"
                />
              </div>

              <div>
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  value={coinData.denomination}
                  onChange={(e) => handleInputChange('denomination', e.target.value)}
                  placeholder="1 Cent"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={coinData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error_coin">Error Coin</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="european">European</SelectItem>
                  <SelectItem value="ancient">Ancient</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auction Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="auction"
                checked={coinData.isAuction}
                onCheckedChange={(checked) => handleInputChange('isAuction', checked)}
              />
              <Label htmlFor="auction">List as Auction</Label>
            </div>

            {/* Price or Starting Bid */}
            <div>
              <Label htmlFor="price">
                {coinData.isAuction ? 'Starting Bid' : 'Price'} ($)
              </Label>
              <Input
                id="price"
                type="number"
                value={coinData.isAuction ? coinData.startingBid : coinData.price}
                onChange={(e) => handleInputChange(
                  coinData.isAuction ? 'startingBid' : 'price', 
                  e.target.value
                )}
                placeholder="0.00"
              />
            </div>

            {coinData.isAuction && (
              <div>
                <Label htmlFor="duration">Auction Duration (Days)</Label>
                <Select
                  value={coinData.auctionDuration}
                  onValueChange={(value) => handleInputChange('auctionDuration', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || images.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Create Listing ({images.length} images)
              </>
            )}
          </Button>

          {images.length > 0 && (
            <p className="text-sm text-center text-gray-600">
              Ready to submit with {images.length} permanent image{images.length > 1 ? 's' : ''} stored in Supabase
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileCoinUploadForm;
