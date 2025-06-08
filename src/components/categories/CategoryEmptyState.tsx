
import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface CategoryEmptyStateProps {
  activeFiltersCount: number;
  clearAllFilters: () => void;
}

const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({ 
  activeFiltersCount, 
  clearAllFilters 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No coins found</h3>
        <p className="text-gray-500 text-sm mb-4">
          There are no coins matching the current filter criteria in this category.
        </p>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-electric-blue hover:text-electric-purple font-medium text-sm"
          >
            Clear all filters to see more results
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryEmptyState;
