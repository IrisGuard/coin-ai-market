
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Sparkles, Clock, Loader2 } from 'lucide-react';

interface CoinListingFormProps {
  listingPrice: string;
  listingDescription: string;
  isListing: boolean;
  onPriceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onListForSale: () => void;
  onStartAuction: () => void;
}

const CoinListingForm = ({
  listingPrice,
  listingDescription,
  isListing,
  onPriceChange,
  onDescriptionChange,
  onListForSale,
  onStartAuction
}: CoinListingFormProps) => {
  return (
    <div className="border-t pt-6">
      <h4 className="font-semibold text-gray-800 mb-4">List on Marketplace</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Price ($) *
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter your listing price"
            value={listingPrice}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <RichTextEditor
            value={listingDescription}
            onChange={onDescriptionChange}
            placeholder="Add any additional details about your coin..."
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={onListForSale}
            disabled={isListing || !listingPrice}
            className="coinvision-button w-full"
          >
            {isListing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            List for Sale
          </Button>
          
          <Button
            onClick={onStartAuction}
            disabled={isListing || !listingPrice}
            variant="outline"
            className="coinvision-button-outline w-full"
          >
            {isListing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            Start Auction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoinListingForm;
