import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateCoin } from '@/hooks/useCoins';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, AlertCircle, Calendar, DollarSign, Tag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import ImageUploader from '@/components/upload/ImageUploader';
import { Rarity, CoinCondition } from '@/types/coin';
import { COIN_CATEGORIES, CoinCategory } from '@/types/category';

interface CoinUploadFormProps {
  listingType: 'direct' | 'auction';
  storeId?: string;
}

const CoinUploadForm: React.FC<CoinUploadFormProps> = ({ listingType, storeId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCoinMutation = useCreateCoin();

  const [name, setName] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [country, setCountry] = useState('');
  const [denomination, setDenomination] = useState('');
  const [grade, setGrade] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [rarity, setRarity] = useState<Rarity>('Common');
  const [condition, setCondition] = useState<CoinCondition>('Good');
  const [category, setCategory] = useState<CoinCategory>('unclassified');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  
  // Auction specific fields
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [reservePrice, setReservePrice] = useState<number | ''>('');
  const [startingBid, setStartingBid] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a listing",
        variant: "destructive",
      });
      return;
    }

    if (!name || !year || !price || images.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one image",
        variant: "destructive",
      });
      return;
    }

    const coinData = {
      name,
      year: Number(year),
      country,
      denomination,
      grade,
      price: Number(price),
      rarity,
      condition,
      category,
      description,
      image: images[0], // Primary image
      additional_images: images.slice(1), // Additional images
      user_id: user.id,
      store_id: storeId,
      featured,
      is_auction: listingType === 'auction',
      listing_type: listingType,
      // Auction specific fields
      ...(listingType === 'auction' && {
        auction_end: auctionEndDate ? new Date(auctionEndDate).toISOString() : undefined,
        reserve_price: reservePrice ? Number(reservePrice) : undefined,
        starting_bid: startingBid ? Number(startingBid) : undefined,
      }),
    };

    createCoinMutation.mutate(coinData, {
      onSuccess: () => {
        toast({
          title: "Listing Created",
          description: `Your ${listingType === 'direct' ? 'direct sale' : 'auction'} listing has been created successfully!`,
        });
        navigate('/dashboard');
      },
      onError: (err: any) => {
        toast({
          title: "Error Creating Listing",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  };

  // Calculate minimum end date for auctions (at least 1 day from now)
  const minEndDate = new Date();
  minEndDate.setDate(minEndDate.getDate() + 1);
  const minEndDateString = minEndDate.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {createCoinMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {createCoinMutation.error instanceof Error ? createCoinMutation.error.message : 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Coin Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. 1921 Morgan Silver Dollar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g. 1921"
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select 
                  value={category} 
                  onValueChange={(value) => setCategory(value as CoinCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COIN_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country of Origin</Label>
                <Input
                  id="country"
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  placeholder="e.g. Dollar, Euro, Pound"
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  placeholder="e.g. MS-65, AU-58"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={condition} 
                  onValueChange={(value) => setCondition(value as CoinCondition)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mint">Mint</SelectItem>
                    <SelectItem value="Near Mint">Near Mint</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rarity">Rarity</Label>
                <Select 
                  value={rarity} 
                  onValueChange={(value) => setRarity(value as Rarity)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the coin's history, condition, and any unique features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Images <span className="text-red-500">*</span></h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload clear images of both sides of your coin. The first image will be used as the main display image.
            </p>
            <ImageUploader 
              images={images}
              setImages={setImages}
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              {listingType === 'direct' ? 'Pricing' : 'Auction Settings'}
            </h3>
            
            {listingType === 'direct' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Feature this listing (increases visibility)</Label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startingBid">Starting Bid ($) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="startingBid"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={startingBid}
                      onChange={(e) => setStartingBid(e.target.value ? Number(e.target.value) : '')}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reservePrice">Reserve Price ($) <span className="text-gray-500 text-sm">(Optional)</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="reservePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value ? Number(e.target.value) : '')}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum price for the auction to complete. If not met, you're not obligated to sell.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auctionEndDate">Auction End Date <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="auctionEndDate"
                      type="date"
                      min={minEndDateString}
                      value={auctionEndDate}
                      onChange={(e) => setAuctionEndDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Feature this auction (increases visibility)</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            disabled={createCoinMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createCoinMutation.isPending}
          >
            {createCoinMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create {listingType === 'direct' ? 'Listing' : 'Auction'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CoinUploadForm;
