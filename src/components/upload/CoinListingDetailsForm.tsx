import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

interface CoinData {
  title: string;
  description: string;
  price: string;
  condition: string;
  year: string;
  country: string;
  denomination: string;
  mint: string;
  composition: string;
  diameter: string;
  weight: string;
  grade: string;
  rarity: string;
  isAuction: boolean;
  startingBid: string;
  auctionDuration: string;
}

interface CoinListingDetailsFormProps {
  coinData: CoinData;
  onCoinDataChange: (data: CoinData) => void;
}

const CoinListingDetailsForm = ({ coinData, onCoinDataChange }: CoinListingDetailsFormProps) => {
  const updateCoinData = (field: string, value: string | boolean) => {
    onCoinDataChange({ ...coinData, [field]: value });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600" />
          Listing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Coin Title *</Label>
            <Input
              id="title"
              value={coinData.title}
              onChange={(e) => updateCoinData('title', e.target.value)}
              placeholder="e.g., 1921 Morgan Silver Dollar"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          {!coinData.isAuction && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                value={coinData.price}
                onChange={(e) => updateCoinData('price', e.target.value)}
                placeholder="0.00"
                className="border-indigo-200 focus:border-indigo-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={coinData.year}
              onChange={(e) => updateCoinData('year', e.target.value)}
              placeholder="e.g., 1921"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={coinData.country}
              onChange={(e) => updateCoinData('country', e.target.value)}
              placeholder="e.g., United States"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="denomination">Denomination</Label>
            <Input
              id="denomination"
              value={coinData.denomination}
              onChange={(e) => updateCoinData('denomination', e.target.value)}
              placeholder="e.g., Dollar"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={coinData.condition} onValueChange={(value) => updateCoinData('condition', value)}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mint State">Mint State</SelectItem>
                <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                <SelectItem value="Very Fine">Very Fine</SelectItem>
                <SelectItem value="Fine">Fine</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="About Good">About Good</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={coinData.grade}
              onChange={(e) => updateCoinData('grade', e.target.value)}
              placeholder="e.g., MS-65, AU-50"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rarity">Rarity</Label>
            <Select value={coinData.rarity} onValueChange={(value) => updateCoinData('rarity', value)}>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Very Rare">Very Rare</SelectItem>
                <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mint">Mint</Label>
            <Input
              id="mint"
              value={coinData.mint}
              onChange={(e) => updateCoinData('mint', e.target.value)}
              placeholder="e.g., Philadelphia, Denver"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="composition">Composition</Label>
            <Input
              id="composition"
              value={coinData.composition}
              onChange={(e) => updateCoinData('composition', e.target.value)}
              placeholder="e.g., 90% Silver, 10% Copper"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diameter">Diameter (mm)</Label>
            <Input
              id="diameter"
              type="number"
              step="0.1"
              value={coinData.diameter}
              onChange={(e) => updateCoinData('diameter', e.target.value)}
              placeholder="e.g., 38.1"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (g)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={coinData.weight}
              onChange={(e) => updateCoinData('weight', e.target.value)}
              placeholder="e.g., 26.73"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={coinData.description}
            onChange={(e) => updateCoinData('description', e.target.value)}
            placeholder="Describe the coin's history, condition, and any special features..."
            className="border-indigo-200 focus:border-indigo-500"
            rows={4}
          />
        </div>

        {/* Auction Option */}
        <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="isAuction"
              checked={coinData.isAuction}
              onChange={(e) => updateCoinData('isAuction', e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <Label htmlFor="isAuction" className="text-lg font-semibold">
              List as Auction
            </Label>
          </div>

          {coinData.isAuction && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startingBid">Starting Bid ($) *</Label>
                <Input
                  id="startingBid"
                  type="number"
                  value={coinData.startingBid}
                  onChange={(e) => updateCoinData('startingBid', e.target.value)}
                  placeholder="0.00"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auctionDuration">Duration</Label>
                <Select value={coinData.auctionDuration} onValueChange={(value) => updateCoinData('auctionDuration', value)}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="10">10 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinListingDetailsForm;
