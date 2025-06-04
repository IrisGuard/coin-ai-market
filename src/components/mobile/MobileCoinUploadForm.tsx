
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCoin } from '@/hooks/useCoinMutations';
import { Upload, Camera } from 'lucide-react';

const MobileCoinUploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    grade: '',
    price: 0,
    rarity: '',
    image: '',
    country: '',
    denomination: '',
    description: '',
    condition: ''
  });

  const createCoin = useCreateCoin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const coinData = {
      name: formData.name,
      year: formData.year,
      grade: formData.grade,
      price: formData.price,
      rarity: formData.rarity,
      image: formData.image,
      country: formData.country,
      denomination: formData.denomination,
      description: formData.description,
    };
    
    createCoin.mutate(coinData);
  };

  const handleImageUpload = () => {
    // Handle image upload logic
    console.log('Image upload triggered');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Coin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Coin Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
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
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rarity">Rarity</Label>
            <Select value={formData.rarity} onValueChange={(value) => setFormData({ ...formData, rarity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="very_rare">Very Rare</SelectItem>
                <SelectItem value="extremely_rare">Extremely Rare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your coin..."
            />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleImageUpload}
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createCoin.isPending}
          >
            {createCoin.isPending ? 'Uploading...' : 'Upload Coin'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MobileCoinUploadForm;
