
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface EnhancedSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ 
  placeholder = "Search...", 
  onSearch 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-14 text-lg px-6 bg-white border-2 border-gray-200 focus:border-electric-blue rounded-xl shadow-lg"
      />
      <Button 
        type="submit"
        className="h-14 px-8 bg-electric-orange hover:bg-electric-orange/90 text-white rounded-xl shadow-lg"
      >
        <Search className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default EnhancedSearchBar;
