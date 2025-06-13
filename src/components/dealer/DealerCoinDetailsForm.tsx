
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DealerCoinDetailsFormProps {
  coinDetails: {
    title: string;
    description: string;
    year: string;
    mint: string;
    errorType: string;
  };
  onUpdate: (field: string, value: string) => void;
}

const DealerCoinDetailsForm = ({ coinDetails, onUpdate }: DealerCoinDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Coin Title *</Label>
          <Input
            id="title"
            value={coinDetails.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="e.g., 1921 Morgan Silver Dollar"
            required
          />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={coinDetails.year}
            onChange={(e) => onUpdate('year', e.target.value)}
            placeholder="e.g., 1921"
          />
        </div>
        <div>
          <Label htmlFor="mint">Mint</Label>
          <Input
            id="mint"
            value={coinDetails.mint}
            onChange={(e) => onUpdate('mint', e.target.value)}
            placeholder="e.g., San Francisco"
          />
        </div>
        <div>
          <Label htmlFor="errorType">Error Type (if applicable)</Label>
          <Input
            id="errorType"
            value={coinDetails.errorType}
            onChange={(e) => onUpdate('errorType', e.target.value)}
            placeholder="e.g., Double Die, Off-Center"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={coinDetails.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Describe the coin's condition, notable features, or historical significance..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default DealerCoinDetailsForm;
