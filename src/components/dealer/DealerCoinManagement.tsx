
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Upload, Search, Filter } from 'lucide-react';

const DealerCoinManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Coin Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Coins
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Coins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coins uploaded yet</h3>
              <p className="text-gray-600 mb-4">
                Upload your first coin to start building your inventory
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload First Coin
                </Button>
                <Button variant="outline">
                  Learn How to Upload
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerCoinManagement;
