
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

interface PriceRangeFilterProps {
  priceFrom: string;
  priceTo: string;
  onPriceChange: (priceFrom: string, priceTo: string) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceFrom,
  priceTo,
  onPriceChange
}) => {
  const [sliderValues, setSliderValues] = useState<number[]>([
    parseFloat(priceFrom) || 0,
    parseFloat(priceTo) || 10000
  ]);

  const minPrice = 0;
  const maxPrice = 10000;

  useEffect(() => {
    setSliderValues([
      parseFloat(priceFrom) || minPrice,
      parseFloat(priceTo) || maxPrice
    ]);
  }, [priceFrom, priceTo]);

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    onPriceChange(
      values[0] === minPrice ? '' : values[0].toString(),
      values[1] === maxPrice ? '' : values[1].toString()
    );
  };

  const handleInputChange = (type: 'from' | 'to', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (type === 'from') {
      onPriceChange(value, priceTo);
      setSliderValues([numValue, sliderValues[1]]);
    } else {
      onPriceChange(priceFrom, value);
      setSliderValues([sliderValues[0], numValue]);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <Label className="text-sm font-semibold">Price Range</Label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500">From</Label>
            <Input
              type="number"
              placeholder="Min price"
              value={priceFrom}
              onChange={(e) => handleInputChange('from', e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">To</Label>
            <Input
              type="number"
              placeholder="Max price"
              value={priceTo}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Slider
            value={sliderValues}
            onValueChange={handleSliderChange}
            max={maxPrice}
            min={minPrice}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>${sliderValues[0]}</span>
            <span>${sliderValues[1]}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSliderChange([0, 100])}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            Under $100
          </button>
          <button
            onClick={() => handleSliderChange([100, 500])}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            $100-$500
          </button>
          <button
            onClick={() => handleSliderChange([500, 10000])}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            $500+
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceRangeFilter;
