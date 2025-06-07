
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, ShoppingCart, Clock, DollarSign } from 'lucide-react';

interface ListingTypeSelectorProps {
  isAuction: boolean;
  onSelectionChange: (isAuction: boolean) => void;
}

const ListingTypeSelector = ({ isAuction, onSelectionChange }: ListingTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Listing Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direct Sale Option */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            !isAuction ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectionChange(false)}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${!isAuction ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Direct Sale</h4>
                <p className="text-sm text-gray-600 mt-1">Set a fixed price for immediate purchase</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Fixed Price</span>
              </div>
              {!isAuction && (
                <Badge className="bg-blue-500">Selected</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Auction Option */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            isAuction ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectionChange(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${isAuction ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Auction</h4>
                <p className="text-sm text-gray-600 mt-1">Let buyers bid competitively</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Time Limited</span>
              </div>
              {isAuction && (
                <Badge className="bg-purple-500">Selected</Badge>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default ListingTypeSelector;
