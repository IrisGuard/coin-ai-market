
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

interface MarketplaceSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdvancedFilters?: () => void;
}

const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  searchTerm,
  setSearchTerm,
  onAdvancedFilters
}) => {
  const { t } = useI18n();

  return (
    <div className="flex gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={t('marketplace.search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-lg bg-white/90 border-2 border-gray-200 focus:border-blue-400 rounded-xl shadow-lg"
        />
      </div>
      
      {onAdvancedFilters && (
        <Button
          variant="outline"
          onClick={onAdvancedFilters}
          className="h-12 px-6 bg-white/90 border-2 border-gray-200 hover:border-blue-400 rounded-xl shadow-lg"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </Button>
      )}
    </div>
  );
};

export default MarketplaceSearch;
