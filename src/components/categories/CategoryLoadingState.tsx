
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CategoryLoadingStateProps {
  categoryTitle: string;
}

const CategoryLoadingState: React.FC<CategoryLoadingStateProps> = ({ categoryTitle }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
        <span className="text-electric-blue">Loading {categoryTitle.toLowerCase()}...</span>
      </div>
    </div>
  );
};

export default CategoryLoadingState;
