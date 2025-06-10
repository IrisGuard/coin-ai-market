
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, X, Command } from 'lucide-react';

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

  // Mock searchable items - in real app, this would come from props or context
  const searchableItems: SearchableItem[] = [
    {
      id: '1',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      category: 'users',
      tags: ['admin', 'roles', 'permissions'],
      path: 'users'
    },
    {
      id: '2',
      title: 'AI Brain Configuration',
      description: 'Configure AI models and automation',
      category: 'ai',
      tags: ['ai', 'automation', 'models'],
      path: 'ai-brain'
    },
    {
      id: '3',
      title: 'API Key Management',
      description: 'Manage API keys and integrations',
      category: 'api',
      tags: ['api', 'keys', 'integrations'],
      path: 'api-keys'
    },
    {
      id: '4',
      title: 'System Health',
      description: 'Monitor system performance and health',
      category: 'system',
      tags: ['health', 'performance', 'monitoring'],
      path: 'system'
    },
    {
      id: '5',
      title: 'Data Sources',
      description: 'Configure external data sources',
      category: 'data',
      tags: ['data', 'sources', 'external'],
      path: 'data-sources'
    },
    {
      id: '6',
      title: 'Analytics Dashboard',
      description: 'View analytics and insights',
      category: 'analytics',
      tags: ['analytics', 'insights', 'dashboard'],
      path: 'analytics'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'users', label: 'Users' },
    { value: 'ai', label: 'AI & Automation' },
    { value: 'api', label: 'API & Integrations' },
    { value: 'system', label: 'System' },
    { value: 'data', label: 'Data' },
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
  }, [query, selectedCategory]);

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
