
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Send, 
  DollarSign, 
  Calendar,
  Globe,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface CoinListingFormProps {
  images: any[];
  aiResults: any;
  coinData: any;
  onCoinDataChange: (data: any) => void;
}

const CoinListingForm: React.FC<CoinListingFormProps> = ({
  images,
  aiResults,
  coinData,
  onCoinDataChange
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const categories = [
    'USA COINS',
    'EUROPEAN COINS',
    'ANCIENT COINS',
    'ERROR COINS',
    'SILVER COINS',
    'GOLD COINS',
    'COMMEMORATIVE COINS',
    'WORLD COINS',
    'RUSSIA COINS',
    'CHINESE COINS',
    'BRITISH COINS',
    'CANADIAN COINS'
  ];

  const grades = [
    'MS-70', 'MS-69', 'MS-68', 'MS-67', 'MS-66', 'MS-65', 'MS-64', 'MS-63', 'MS-62', 'MS-61', 'MS-60',
    'AU-58', 'AU-55', 'AU-53', 'AU-50',
    'XF-45', 'XF-40',
    'VF-35', 'VF-30', 'VF-25', 'VF-20',
    'F-15', 'F-12',
    'VG-10', 'VG-8',
    'G-6', 'G-4',
    'AG-3',
    'FR-2',
    'PR-1'
  ];

  const updateField = (field: string, value: any) => {
    onCoinDataChange({
      ...coinData,
      [field]: value
    });
  };

  const handleSubmit = async (asDraft = false) => {
    setIsSubmitting(true);
    setIsDraft(asDraft);

    try {
      if (!asDraft) {
        if (!coinData.title || !coinData.category || !coinData.price) {
          toast.error('Please fill in all required fields');
          return;
        }
        if (images.length === 0) {
          toast.error('Please upload at least one image');
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (asDraft) {
        toast.success('Draft saved successfully!');
      } else {
        toast.success('Listing created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsDraft(false);
    }
  };

  useEffect(() => {
    if (aiResults && !coinData.title) {
      onCoinDataChange({
        ...coinData,
        title: aiResults.analysis?.name || '',
        year: aiResults.analysis?.year?.toString() || '',
        grade: aiResults.analysis?.grade || '',
        composition: aiResults.analysis?.composition || '',
        diameter: aiResults.analysis?.diameter?.toString() || '',
        weight: aiResults.analysis?.weight?.toString() || '',
        price: aiResults.analysis?.estimated_value?.toString() || '',
        country: aiResults.analysis?.country || '',
        denomination: aiResults.analysis?.denomination || '',
        mint: aiResults.analysis?.mint || '',
        rarity: aiResults.analysis?.rarity || 'Common',
        errors: aiResults.errors || []
      });
    }
  }, [aiResults, coinData, onCoinDataChange]);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Coin Listing Details
          {aiResults && (
            <Badge variant="outline" className="ml-auto">
              <TrendingUp className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={coinData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., 1921 Morgan Silver Dollar MS-63"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={coinData.category || ''} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coin category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={coinData.year || ''}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="e.g., 1921"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={coinData.country || ''}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="e.g., United States"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="grade">Grade/Condition</Label>
              <Select value={coinData.grade || ''} onValueChange={(value) => updateField('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={coinData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed description of the coin condition, features, and any notable characteristics..."
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  value={coinData.denomination || ''}
                  onChange={(e) => updateField('denomination', e.target.value)}
                  placeholder="e.g., $1, 50 Cent"
                />
              </div>
              <div>
                <Label htmlFor="mint">Mint</Label>
                <Input
                  id="mint"
                  value={coinData.mint || ''}
                  onChange={(e) => updateField('mint', e.target.value)}
                  placeholder="e.g., Philadelphia, Denver"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="composition">Composition</Label>
                <Input
                  id="composition"
                  value={coinData.composition || ''}
                  onChange={(e) => updateField('composition', e.target.value)}
                  placeholder="e.g., 90% Silver, 10% Copper"
                />
              </div>
              <div>
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={coinData.rarity || ''} onValueChange={(value) => updateField('rarity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Very Rare">Very Rare</SelectItem>
                    <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
                    <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diameter">Diameter (mm)</Label>
                <Input
                  id="diameter"
                  value={coinData.diameter || ''}
                  onChange={(e) => updateField('diameter', e.target.value)}
                  placeholder="e.g., 38.1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  value={coinData.weight || ''}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder="e.g., 26.73"
                />
              </div>
            </div>

            {coinData.errors && coinData.errors.length > 0 && (
              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Detected Errors
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {coinData.errors.map((error: string, index: number) => (
                    <Badge key={index} variant="destructive">
                      {error}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auction-mode"
                checked={coinData.isAuction || false}
                onCheckedChange={(checked) => updateField('isAuction', checked)}
              />
              <Label htmlFor="auction-mode">Auction Mode</Label>
            </div>

            {coinData.isAuction ? (
              <>
                <div>
                  <Label htmlFor="startingBid">Starting Bid (USD) *</Label>
                  <Input
                    id="startingBid"
                    type="number"
                    value={coinData.startingBid || ''}
                    onChange={(e) => updateField('startingBid', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="reservePrice">Reserve Price (USD)</Label>
                  <Input
                    id="reservePrice"
                    type="number"
                    value={coinData.reservePrice || ''}
                    onChange={(e) => updateField('reservePrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="auctionDuration">Auction Duration</Label>
                  <Select value={coinData.auctionDuration || '7'} onValueChange={(value) => updateField('auctionDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="10">10 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={coinData.price || ''}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={coinData.featured || false}
                onCheckedChange={(checked) => updateField('featured', checked)}
              />
              <Label htmlFor="featured">Featured Listing</Label>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={coinData.keywords || ''}
                onChange={(e) => updateField('keywords', e.target.value)}
                placeholder="e.g., morgan, silver, dollar, 1921"
              />
            </div>

            <div>
              <Label htmlFor="provenance">Provenance</Label>
              <Textarea
                id="provenance"
                value={coinData.provenance || ''}
                onChange={(e) => updateField('provenance', e.target.value)}
                placeholder="History of ownership, certificates, authentication details..."
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => handleSubmit(true)}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isDraft ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving Draft...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting || images.length === 0}
            className="flex-1"
          >
            {isSubmitting && !isDraft ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publish Listing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinListingForm;
