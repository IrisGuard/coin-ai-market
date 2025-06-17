
import React from 'react';
import { Check } from 'lucide-react';

interface Background {
  id: string;
  name: string;
  color: string;
  preview: string;
}

interface BackgroundColorSelectorProps {
  backgrounds: Background[];
  selectedBackground: string;
  onBackgroundChange: (color: string) => void;
}

export const BackgroundColorSelector: React.FC<BackgroundColorSelectorProps> = ({
  backgrounds,
  selectedBackground,
  onBackgroundChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Background Color</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            className={`relative cursor-pointer rounded-lg border-2 transition-all ${
              selectedBackground === bg.color 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
            onClick={() => onBackgroundChange(bg.color)}
          >
            <div className={`h-20 rounded-lg ${bg.preview} flex items-center justify-center`}>
              {selectedBackground === bg.color && (
                <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-1" />
              )}
              {bg.id === 'transparent' && (
                <span className="text-xs text-gray-500 font-mono">PNG</span>
              )}
            </div>
            <div className="p-2 text-center">
              <div className="font-medium text-xs">{bg.name}</div>
              <div className="text-xs text-muted-foreground">{bg.color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
