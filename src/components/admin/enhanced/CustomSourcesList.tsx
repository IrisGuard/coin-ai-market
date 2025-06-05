
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Brain, TestTube, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomSource {
  id: string;
  name: string;
  url: string;
  type: string;
  description: string;
  scraping_enabled: boolean;
  status: string;
  ai_integration: boolean;
  created_at: string;
}

interface CustomSourcesListProps {
  sources: CustomSource[];
  onRemoveSource: (id: string) => void;
  onTestSource: (url: string) => void;
}

const CustomSourcesList = ({ sources, onRemoveSource, onTestSource }: CustomSourcesListProps) => {
  const sourceTypes = [
    { value: 'encyclopedia', label: 'Γενική Εγκυκλοπαίδεια' },
    { value: 'price_guide', label: 'Οδηγός Τιμών' },
    { value: 'auction', label: 'Δημοπρασίες' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'reference', label: 'Βιβλιογραφία' },
    { value: 'forum', label: 'Forum/Community' },
    { value: 'news', label: 'Νέα & Άρθρα' },
    { value: 'database', label: 'Database' }
  ];

  const removeSource = (id: string) => {
    onRemoveSource(id);
    toast({
      title: "Αφαίρεση",
      description: "Το σαιτ αφαιρέθηκε από τον εγκέφαλο",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-600" />
          Προσωπικές Πηγές Εγκυκλοπαίδειας ({sources.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Όλα τα σαιτ που έχετε προσθέσει στον AI εγκέφαλο
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {source.name}
                  {source.ai_integration && (
                    <Brain className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{source.url}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    {sourceTypes.find(t => t.value === source.type)?.label || source.type}
                  </Badge>
                  <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                    {source.status === 'active' ? 'Ενεργό' : 'Ανενεργό'}
                  </Badge>
                  {source.ai_integration && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Ready
                    </Badge>
                  )}
                  {source.scraping_enabled && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Auto-Extract
                    </Badge>
                  )}
                </div>
                {source.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {source.description}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onTestSource(source.url)}
                >
                  <TestTube className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => removeSource(source.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {sources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Δεν έχετε προσθέσει ακόμα custom σαιτ</p>
              <p className="text-sm">Προσθέστε το πρώτο σας σαιτ νομισμάτων παραπάνω!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomSourcesList;
