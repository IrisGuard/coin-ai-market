
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, X, Command } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchableItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  path?: string;
}

interface AdminAdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

const AdminAdvancedSearch: React.FC<AdminAdvancedSearchProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get real searchable items from database
  const { data: searchableItems = [] } = useQuery({
    queryKey: ['admin-search-items'],
    queryFn: async (): Promise<SearchableItem[]> => {
      const [
        { data: users },
        { data: coins },
        { data: stores },
        { data: categories },
        { data: commands },
        { data: sources }
      ] = await Promise.all([
        supabase.from('profiles').select('id, name, role').limit(20),
        supabase.from('coins').select('id, name, category').limit(20),
        supabase.from('stores').select('id, name, description').limit(20),
        supabase.from('categories').select('id, name, description').limit(20),
        supabase.from('ai_commands').select('id, name, description, category').limit(20),
        supabase.from('external_price_sources').select('id, source_name, source_type').limit(20)
      ]);

      const items: SearchableItem[] = [];

      // Add real users
      users?.forEach(user => {
        items.push({
          id: `user-${user.id}`,
          title: `User: ${user.name || 'Unknown'}`,
          description: `Role: ${user.role || 'user'}`,
          category: 'users',
          tags: ['user', user.role || 'user'],
          path: `users/${user.id}`
        });
      });

      // Add real coins
      coins?.forEach(coin => {
        items.push({
          id: `coin-${coin.id}`,
          title: `Coin: ${coin.name}`,
          description: `Category: ${coin.category || 'Unknown'}`,
          category: 'coins',
          tags: ['coin', coin.category || 'unknown'],
          path: `coins/${coin.id}`
        });
      });

      // Add real stores
      stores?.forEach(store => {
        items.push({
          id: `store-${store.id}`,
          title: `Store: ${store.name}`,
          description: store.description || 'No description',
          category: 'stores',
          tags: ['store', 'marketplace'],
          path: `stores/${store.id}`
        });
      });

      // Add real categories
      categories?.forEach(category => {
        items.push({
          id: `category-${category.id}`,
          title: `Category: ${category.name}`,
          description: category.description || 'No description',
          category: 'categories',
          tags: ['category', 'taxonomy'],
          path: `categories/${category.id}`
        });
      });

      // Add real AI commands
      commands?.forEach(command => {
        items.push({
          id: `command-${command.id}`,
          title: `AI Command: ${command.name}`,
          description: command.description || 'No description',
          category: 'ai',
          tags: ['ai', 'command', command.category || 'general'],
          path: `ai-brain/commands/${command.id}`
        });
      });

      // Add real data sources
      sources?.forEach(source => {
        items.push({
          id: `source-${source.id}`,
          title: `Data Source: ${source.source_name}`,
          description: `Type: ${source.source_type}`,
          category: 'data-sources',
          tags: ['data', 'source', source.source_type],
          path: `data-sources/${source.id}`
        });
      });

      return items;
    }
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'users', label: 'Users' },
    { value: 'coins', label: 'Coins' },
    { value: 'stores', label: 'Stores' },
    { value: 'categories', label: 'Categories' },
    { value: 'ai', label: 'AI & Commands' },
    { value: 'data-sources', label: 'Data Sources' },
    { value: 'analytics', label: 'Analytics' }
  ];

  const filteredItems = useMemo(() => {
    let items = searchableItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      items = items.filter(item => {
        const searchableText = [
          item.title,
          item.description || '',
          ...(item.tags || [])
        ].join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    return items;
  }, [searchableItems, query, selectedCategory]);

  const handleItemClick = (item: SearchableItem) => {
    if (item.path && onNavigate) {
      onNavigate(item.path);
      onClose();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelectedCategory('all');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search admin features, settings, or actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.value === item.category)?.label}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm">Try adjusting your search terms or category filter</p>
              </div>
            )}
          </div>

          {/* Search Tips */}
          <div className="border-t pt-4 text-xs text-muted-foreground">
            <p><strong>Tips:</strong> Use specific keywords, try different categories, or search by feature names</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAdvancedSearch;
