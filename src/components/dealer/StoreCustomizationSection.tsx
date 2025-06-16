
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Store, Palette, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const StoreCustomizationSection = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerImage(file);
    }
  };

  const handleSaveCustomization = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would implement the actual save logic
      // For now, just show success message
      toast({
        title: "Success",
        description: "Store customization saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save store customization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Store Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              placeholder="Enter your store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          {/* Store Description */}
          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              placeholder="Describe your store and what makes it special"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Banner Upload */}
          <div className="space-y-3">
            <Label htmlFor="bannerUpload">Store Banner (Optional)</Label>
            <div className="flex items-start gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <p className="text-sm text-gray-600">
                  <strong>Recommended banner dimensions: 1200x300 pixels</strong>
                </p>
                <input
                  id="bannerUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {bannerImage && (
                  <p className="text-sm text-green-600">
                    Selected: {bannerImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Color Customization */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Store Theme Color
            </Label>
            <Input
              type="color"
              defaultValue="#3B82F6"
              className="w-20 h-10 p-1 border rounded"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSaveCustomization}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Store Customization'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreCustomizationSection;
