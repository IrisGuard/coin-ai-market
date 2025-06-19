
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Camera, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MobileSearchProps {
  onSearch: (query: string, filters?: any) => void;
  placeholder?: string;
}

const MobileSearch = ({ onSearch, placeholder = "Search coins..." }: MobileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  // Fetch real search suggestions from database
  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('name, category, country')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: searchQuery.length >= 2
  });

  // Fetch available categories for filters
  const { data: categories } = useQuery({
    queryKey: ['search-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const uniqueCategories = [...new Set(data?.map(item => item.category))] as string[];
      return uniqueCategories.filter(Boolean);
    }
  });

  const handleSearch = () => {
    onSearch(searchQuery, { categories: selectedFilters });
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.onstart = () => setIsVoiceSearch(true);
      recognition.onend = () => setIsVoiceSearch(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript, { categories: selectedFilters });
      };
      recognition.start();
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedFilters]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-20 py-3 text-base"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={startVoiceSearch}
              disabled={isVoiceSearch}
              className="p-1"
            >
              <Mic className={`w-4 h-4 ${isVoiceSearch ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-1"
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions && suggestions.length > 0 && searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion.name);
                  onSearch(suggestion.name, { categories: selectedFilters });
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-sm text-gray-500">
                  {suggestion.category} • {suggestion.country}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Active Filters */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterToggle(filter)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Filters</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedFilters.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFilterToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileSearch;
