
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Plus, 
  Search, 
  AlertCircle, 
  TrendingUp,
  ExternalLink,
  Brain,
  Target
} from 'lucide-react';
import { useErrorCoinsKnowledge, useAddErrorKnowledge } from '@/hooks/useErrorCoinsKnowledge';

const ErrorKnowledgeManager = () => {
  const { data: knowledge } = useErrorCoinsKnowledge();
  const addKnowledge = useAddErrorKnowledge();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [newKnowledge, setNewKnowledge] = useState({
    error_type: '',
    error_category: 'die_error',
    error_name: '',
    description: '',
    identification_techniques: [],
    common_mistakes: [],
    reference_links: [],
    severity_level: 1,
    rarity_score: 1,
    technical_specifications: {},
    ai_detection_markers: {}
  });

  const errorCategories = [
    { value: 'die_error', label: 'Die Errors', icon: '🔨' },
    { value: 'planchet_error', label: 'Planchet Errors', icon: '⚪' },
    { value: 'strike_error', label: 'Strike Errors', icon: '💥' }
  ];

  const getSeverityColor = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-orange-100 text-orange-800',
      4: 'bg-red-100 text-red-800',
      5: 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getRarityStars = (score: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span key={i} className={`text-xs ${i < score ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const filteredKnowledge = knowledge?.filter(item => {
    const matchesSearch = item.error_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.error_category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddKnowledge = () => {
    addKnowledge.mutate(newKnowledge);
    setIsAddDialogOpen(false);
    setNewKnowledge({
      error_type: '',
      error_category: 'die_error',
      error_name: '',
      description: '',
      identification_techniques: [],
      common_mistakes: [],
      reference_links: [],
      severity_level: 1,
      rarity_score: 1,
      technical_specifications: {},
      ai_detection_markers: {}
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Error Coins Knowledge Base
          </h3>
          <p className="text-sm text-muted-foreground">
            Technical knowledge and identification guidelines for error coins
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Error Knowledge Entry</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="identification">Identification</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="error_name">Error Name</Label>
                    <Input
                      id="error_name"
                      value={newKnowledge.error_name}
                      onChange={(e) => setNewKnowledge({...newKnowledge, error_name: e.target.value})}
                      placeholder="e.g., 1955 Doubled Die Obverse"
                    />
                  </div>
                  <div>
                    <Label htmlFor="error_type">Error Type</Label>
                    <Input
                      id="error_type"
                      value={newKnowledge.error_type}
                      onChange={(e) => setNewKnowledge({...newKnowledge, error_type: e.target.value})}
                      placeholder="e.g., doubled_die"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="error_category">Error Category</Label>
                  <Select value={newKnowledge.error_category} onValueChange={(value) => setNewKnowledge({...newKnowledge, error_category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {errorCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newKnowledge.description}
                    onChange={(e) => setNewKnowledge({...newKnowledge, description: e.target.value})}
                    placeholder="Detailed technical description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="severity_level">Severity Level (1-5)</Label>
                    <Select value={newKnowledge.severity_level.toString()} onValueChange={(value) => setNewKnowledge({...newKnowledge, severity_level: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(level => (
                          <SelectItem key={level} value={level.toString()}>
                            Level {level} - {['Minor', 'Moderate', 'Significant', 'Major', 'Extreme'][level-1]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rarity_score">Rarity Score (1-10)</Label>
                    <Select value={newKnowledge.rarity_score.toString()} onValueChange={(value) => setNewKnowledge({...newKnowledge, rarity_score: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 10}, (_, i) => i + 1).map(score => (
                          <SelectItem key={score} value={score.toString()}>
                            {score} Star{score > 1 ? 's' : ''} - {score <= 3 ? 'Common' : score <= 6 ? 'Uncommon' : score <= 8 ? 'Rare' : 'Extremely Rare'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="identification" className="space-y-4">
                <div>
                  <Label>Identification Techniques</Label>
                  <Textarea
                    placeholder="Enter techniques separated by newlines..."
                    onChange={(e) => setNewKnowledge({
                      ...newKnowledge, 
                      identification_techniques: e.target.value.split('\n').filter(t => t.trim())
                    })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Common Mistakes</Label>
                  <Textarea
                    placeholder="Enter common mistakes separated by newlines..."
                    onChange={(e) => setNewKnowledge({
                      ...newKnowledge, 
                      common_mistakes: e.target.value.split('\n').filter(t => t.trim())
                    })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Reference Links</Label>
                  <Textarea
                    placeholder="Enter reference URLs separated by newlines..."
                    onChange={(e) => setNewKnowledge({
                      ...newKnowledge, 
                      reference_links: e.target.value.split('\n').filter(t => t.trim())
                    })}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div>
                  <Label>Technical Specifications (JSON)</Label>
                  <Textarea
                    placeholder='{"die_state": "early", "hub_alignment": "rotated"}'
                    onChange={(e) => {
                      try {
                        setNewKnowledge({...newKnowledge, technical_specifications: JSON.parse(e.target.value)});
                      } catch {}
                    }}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>AI Detection Markers (JSON)</Label>
                  <Textarea
                    placeholder='{"key_features": ["doubling_direction", "shelf_effect"], "detection_areas": ["date", "motto"]}'
                    onChange={(e) => {
                      try {
                        setNewKnowledge({...newKnowledge, ai_detection_markers: JSON.parse(e.target.value)});
                      } catch {}
                    }}
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddKnowledge} className="flex-1">
                Add Knowledge Entry
              </Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search error knowledge..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {errorCategories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredKnowledge?.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.error_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {errorCategories.find(c => c.value === item.error_category)?.icon} {item.error_category.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getSeverityColor(item.severity_level)}>
                      Level {item.severity_level}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Rarity</div>
                  <div className="flex items-center">
                    {getRarityStars(item.rarity_score)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.description}
              </p>

              {item.identification_techniques && item.identification_techniques.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Target className="h-3 w-3" />
                    Identification Techniques
                  </h4>
                  <div className="space-y-1">
                    {item.identification_techniques.slice(0, 2).map((technique, index) => (
                      <div key={index} className="text-xs bg-muted p-2 rounded">
                        • {technique}
                      </div>
                    ))}
                    {item.identification_techniques.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{item.identification_techniques.length - 2} more techniques
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.common_mistakes && item.common_mistakes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    Common Mistakes
                  </h4>
                  <div className="space-y-1">
                    {item.common_mistakes.slice(0, 2).map((mistake, index) => (
                      <div key={index} className="text-xs bg-orange-50 text-orange-700 p-2 rounded">
                        ⚠ {mistake}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.reference_links && item.reference_links.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <ExternalLink className="h-3 w-3" />
                    References
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {item.reference_links.slice(0, 2).map((link, index) => (
                      <Button key={index} variant="outline" size="sm" className="text-xs h-6" asChild>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          Source {index + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Train
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Market Data
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredKnowledge?.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Knowledge Entries Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchFilter || categoryFilter !== 'all' 
                ? 'No entries match your current filters'
                : 'Add error coin knowledge to help train the AI recognition system'
              }
            </p>
            {!searchFilter && categoryFilter === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Knowledge Entry
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorKnowledgeManager;
