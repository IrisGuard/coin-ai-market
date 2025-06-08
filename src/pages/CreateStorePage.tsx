
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Store, Upload } from 'lucide-react';

const CreateStorePage = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Store</h1>
          <p className="text-gray-600">
            Set up your dealer store to start selling coins on our marketplace
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-6 h-6" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" placeholder="Your Store Name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input id="storeEmail" type="email" placeholder="store@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea 
                id="storeDescription" 
                placeholder="Describe your store, specialties, and what makes you unique..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input id="storePhone" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeWebsite">Website (Optional)</Label>
                <Input id="storeWebsite" placeholder="https://yourstore.com" />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Store Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your store logo</p>
                <Button variant="outline">Choose File</Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Store Settings</Label>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Accept International Orders</Label>
                  <p className="text-sm text-gray-600">Allow customers from other countries to purchase</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Instant Purchase Available</Label>
                  <p className="text-sm text-gray-600">Allow immediate purchases without negotiation</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auction Listings</Label>
                  <p className="text-sm text-gray-600">Enable auction-style listings for your items</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button className="flex-1">Create Store</Button>
              <Button variant="outline" className="flex-1">Save as Draft</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateStorePage;
