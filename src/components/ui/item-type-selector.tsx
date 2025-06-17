
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Coins, Banknote } from 'lucide-react';
import type { ItemType } from '@/types/upload';

interface ItemTypeSelectorProps {
  value: ItemType;
  onValueChange: (value: ItemType) => void;
  className?: string;
}

export const ItemTypeSelector: React.FC<ItemTypeSelectorProps> = ({
  value,
  onValueChange,
  className = ""
}) => {
  return (
    <Card className={`border-2 border-blue-200 bg-blue-50/30 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span>Τι ανεβάζετε;</span>
          </h3>
          
          <RadioGroup 
            value={value} 
            onValueChange={onValueChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <RadioGroupItem value="coin" id="coin" />
              <Label htmlFor="coin" className="flex items-center gap-2 cursor-pointer flex-1">
                <Coins className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-medium">Νόμισμα 🪙</div>
                  <div className="text-xs text-gray-500">Circular crop</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <RadioGroupItem value="banknote" id="banknote" />
              <Label htmlFor="banknote" className="flex items-center gap-2 cursor-pointer flex-1">
                <Banknote className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Χαρτονόμισμα 💵</div>
                  <div className="text-xs text-gray-500">Rectangular crop</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Background:</strong> Όλες οι εικόνες θα έχουν ενιαίο ανοιχτό γκρι background (#F5F5F5)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
