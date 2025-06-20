
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image, Zap, Brain, Globe } from 'lucide-react';

const DealerUploadManager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            AI-Powered Upload Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Camera className="w-8 h-8 mx-auto text-blue-600 mb-3" />
                  <h3 className="font-medium mb-2">Take Photo</h3>
                  <p className="text-sm text-gray-600">Use camera to capture coin images</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-dashed border-green-300 hover:border-green-500 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Image className="w-8 h-8 mx-auto text-green-600 mb-3" />
                  <h3 className="font-medium mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-600">Select images from device</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 mx-auto text-purple-600 mb-3" />
                  <h3 className="font-medium mb-2">Bulk Upload</h3>
                  <p className="text-sm text-gray-600">Upload multiple coins at once</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Features */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium">AI Analysis Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Automatic Detection</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Coin identification</li>
                      <li>• Grade assessment</li>
                      <li>• Error detection</li>
                      <li>• Authenticity check</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Market Intelligence</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Price valuation</li>
                      <li>• Market trends</li>
                      <li>• Rarity assessment</li>
                      <li>• Sale recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Sources */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Global Market Data</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Our AI analyzes data from worldwide sources including eBay, Heritage Auctions, 
                  and major coin marketplaces to provide accurate valuations.
                </p>
                <Button className="w-full">
                  Start AI Upload
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerUploadManager;
