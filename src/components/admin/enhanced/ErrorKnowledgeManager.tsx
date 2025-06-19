
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Database,
  Save,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ErrorKnowledgeManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch error coins knowledge base
  const { data: knowledgeBase, isLoading } = useQuery({
    queryKey: ['error-coins-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch error reference sources
  const { data: referenceSources } = useQuery({
    queryKey: ['error-reference-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_reference_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create/Update knowledge entry
  const knowledgeMutation = useMutation({
    mutationFn: async (knowledgeData: any) => {
      if (knowledgeData.id) {
        const { error } = await supabase
          .from('error_coins_knowledge')
          .update(knowledgeData)
          .eq('id', knowledgeData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('error_coins_knowledge')
          .insert(knowledgeData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-knowledge'] });
      toast({
        title: "Success",
        description: "Knowledge entry saved successfully",
      });
      setIsEditing(false);
      setEditingItem(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete knowledge entry
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('error_coins_knowledge')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-knowledge'] });
      toast({
        title: "Success",
        description: "Knowledge entry deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredKnowledge = knowledgeBase?.filter(item =>
    item.error_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.error_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSave = (formData: FormData) => {
    const knowledgeData = {
      id: editingItem?.id,
      error_name: formData.get('error_name') as string,
      error_type: formData.get('error_type') as string,
      error_category: formData.get('error_category') as string,
      description: formData.get('description') as string,
      rarity_score: parseInt(formData.get('rarity_score') as string) || 1,
      severity_level: parseInt(formData.get('severity_level') as string) || 1,
      detection_difficulty: parseInt(formData.get('detection_difficulty') as string) || 1,
      market_premium_multiplier: parseFloat(formData.get('market_premium_multiplier') as string) || 1.0,
    };

    knowledgeMutation.mutate(knowledgeData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Entries</p>
                <p className="text-xl font-bold">{knowledgeBase?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Error Types</p>
                <p className="text-xl font-bold">
                  {new Set(knowledgeBase?.map(k => k.error_type)).size || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Reference Sources</p>
                <p className="text-xl font-bold">{referenceSources?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">AI Training Ready</p>
                <p className="text-xl font-bold">
                  {knowledgeBase?.filter(k => k.ai_detection_markers).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search error coins knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button
          onClick={() => {
            setIsEditing(true);
            setEditingItem(null);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Knowledge Entry
        </Button>
      </div>

      {/* Knowledge Base Tabs */}
      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Knowledge Entries</TabsTrigger>
          <TabsTrigger value="sources">Reference Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {filteredKnowledge.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{entry.error_name}</CardTitle>
                    <Badge variant="outline">{entry.error_type}</Badge>
                    <Badge variant="secondary">{entry.error_category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingItem(entry);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{entry.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Rarity:</span>
                    <div className="text-blue-600">{entry.rarity_score}/10</div>
                  </div>
                  <div>
                    <span className="font-medium">Severity:</span>
                    <div className="text-orange-600">{entry.severity_level}/10</div>
                  </div>
                  <div>
                    <span className="font-medium">Detection:</span>
                    <div className="text-purple-600">{entry.detection_difficulty}/10</div>
                  </div>
                  <div>
                    <span className="font-medium">Premium:</span>
                    <div className="text-green-600">{entry.market_premium_multiplier}x</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {referenceSources?.map((source) => (
            <Card key={source.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{source.source_name}</CardTitle>
                  <Badge variant="outline">{source.source_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">URL:</span>
                    <a 
                      href={source.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {source.source_url}
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="font-medium">Reliability:</span>
                      <span className="ml-1 text-green-600">
                        {Math.round((source.reliability_score || 0) * 100)}%
                      </span>
                    </div>
                    {source.last_scraped && (
                      <div>
                        <span className="font-medium">Last Scraped:</span>
                        <span className="ml-1 text-gray-600">
                          {new Date(source.last_scraped).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingItem ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium">Error Name</label>
                  <Input
                    name="error_name"
                    defaultValue={editingItem?.error_name || ''}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Error Type</label>
                    <Input
                      name="error_type"
                      defaultValue={editingItem?.error_type || ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      name="error_category"
                      defaultValue={editingItem?.error_category || ''}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    name="description"
                    defaultValue={editingItem?.description || ''}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Rarity (1-10)</label>
                    <Input
                      name="rarity_score"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={editingItem?.rarity_score || 1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity (1-10)</label>
                    <Input
                      name="severity_level"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={editingItem?.severity_level || 1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Detection (1-10)</label>
                    <Input
                      name="detection_difficulty"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={editingItem?.detection_difficulty || 1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Premium Multiplier</label>
                    <Input
                      name="market_premium_multiplier"
                      type="number"
                      step="0.1"
                      min="1"
                      defaultValue={editingItem?.market_premium_multiplier || 1.0}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={knowledgeMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ErrorKnowledgeManager;
