
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default EnhancedSearchBar;
