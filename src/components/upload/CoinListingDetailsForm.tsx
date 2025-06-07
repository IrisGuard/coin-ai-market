
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign, Calendar, Award, Globe, Coins } from 'lucide-react';
import type { CoinData } from '@/types/upload';

interface CoinListingDetailsFormProps {
  coinData: CoinData;
  onCoinDataChange: (data: CoinData) => void;
}

const CoinListingDetailsForm = ({ coinData, onCoinDataChange }: CoinListingDetailsFormProps) => {
  const updateField = (field: keyof CoinData, value: any) => {
    onCoinDataChange({
      ...coinData,
      [field]: value
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-indigo-600" />
          Listing Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              value={coinData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter coin title"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium text-gray-700">
              Year
            </Label>
            <Input
              id="year"
              value={coinData.year}
              onChange={(e) => updateField('year', e.target.value)}
              placeholder="e.g., 1921"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={coinData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe your coin's condition, history, and notable features..."
            className="min-h-[100px] border-indigo-200 focus:border-indigo-500"
          />
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <Label className="text-sm font-medium text-gray-700">Auction Mode</Label>
            </div>
            <Switch
              checked={coinData.isAuction}
              onCheckedChange={(checked) => updateField('isAuction', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              {coinData.isAuction ? 'Starting Bid *' : 'Fixed Price *'}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={coinData.isAuction ? coinData.startingBid : coinData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (coinData.isAuction) {
                  updateField('startingBid', value);
                } else {
                  updateField('price', value);
                }
              }}
              placeholder="Enter amount in USD"
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>

          {coinData.isAuction && (
            <div className="space-y-2">
              <Label htmlFor="auctionDuration" className="text-sm font-medium text-gray-700">
                Auction Duration (days)
              </Label>
              <Select
                value={coinData.auctionDuration.toString()}
                onValueChange={(value) => updateField('auctionDuration', parseInt(value))}
              >
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Coin Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
              Condition
            </Label>
            <Select
              value={coinData.condition}
              onValueChange={(value) => updateField('condition', value)}
            >
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poor">Poor (P-1)</SelectItem>
                <SelectItem value="Fair">Fair (FR-2)</SelectItem>
                <SelectItem value="About Good">About Good (AG-3)</SelectItem>
                <SelectItem value="Good">Good (G-4, G-6)</SelectItem>
                <SelectItem value="Very Good">Very Good (VG-8, VG-10)</SelectItem>
                <SelectItem value="Fine">Fine (F-12, F-15)</SelectItem>
                <SelectItem value="Very Fine">Very Fine (VF-20, VF-25, VF-30, VF-35)</SelectItem>
                <SelectItem value="Extremely Fine">Extremely Fine (EF-40, EF-45)</SelectItem>
                <SelectItem value="About Uncirculated">About Uncirculated (AU-50, AU-53, AU-55, AU-58)</SelectItem>
                <SelectItem value="Mint State">Mint State (MS-60 to MS-70)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
              Grade
            </Label>
            <Input
              id="grade"
              value={coinData.grade}
              onChange={(e) => updateField('grade', e.target.value)}
              placeholder="e.g., MS-65, AU-58"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rarity" className="text-sm font-medium text-gray-700">
              Rarity
            </Label>
            <Select
              value={coinData.rarity}
              onValueChange={(value) => updateField('rarity', value)}
            >
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Scarce">Scarce</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Very Rare">Very Rare</SelectItem>
                <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </Label>
            <Input
              id="country"
              value={coinData.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="e.g., United States"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="denomination" className="text-sm font-medium text-gray-700">
              Denomination
            </Label>
            <Input
              id="denomination"
              value={coinData.denomination}
              onChange={(e) => updateField('denomination', e.target.value)}
              placeholder="e.g., Dollar, Cent"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mint" className="text-sm font-medium text-gray-700">
              Mint
            </Label>
            <Input
              id="mint"
              value={coinData.mint}
              onChange={(e) => updateField('mint', e.target.value)}
              placeholder="e.g., Philadelphia, Denver"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Technical Specifications
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="composition" className="text-sm font-medium text-gray-700">
                Composition
              </Label>
              <Input
                id="composition"
                value={coinData.composition}
                onChange={(e) => updateField('composition', e.target.value)}
                placeholder="e.g., 90% Silver, 10% Copper"
                className="border-slate-200 focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diameter" className="text-sm font-medium text-gray-700">
                Diameter (mm)
              </Label>
              <Input
                id="diameter"
                value={coinData.diameter}
                onChange={(e) => updateField('diameter', e.target.value)}
                placeholder="e.g., 38.1"
                className="border-slate-200 focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Weight (g)
              </Label>
              <Input
                id="weight"
                value={coinData.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                placeholder="e.g., 26.73"
                className="border-slate-200 focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinListingDetailsForm;
