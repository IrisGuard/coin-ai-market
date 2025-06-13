
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Filter,
  Brain,
  TrendingUp,
  Shield,
  AlertTriangle,
  Microscope,
  Calculator
} from 'lucide-react';
import { useEnhancedErrorKnowledge, useDetectCoinErrors, useCalculateErrorCoinValue } from '@/hooks/useEnhancedErrorKnowledge';
import { toast } from '@/hooks/use-toast';

const EnhancedErrorKnowledgeManager = () => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: knowledgeEntries, isLoading } = useEnhancedErrorKnowledge();
  const detectErrors = useDetectCoinErrors();
  const calculateValue = useCalculateErrorCoinValue();

  const categories = ['all', 'die_error', 'strike_error', 'planchet_error', 'design_error'];

  const filteredEntries = knowledgeEntries?.filter(entry => {
    const matchesSearch = entry.error_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.error_category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getRarityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-orange-100 text-orange-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800';
    if (difficulty >= 8) return 'bg-red-100 text-red-800';
    if (difficulty >= 6) return 'bg-orange-100 text-orange-800';
    if (difficulty >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleTestDetection = async () => {
    try {
      const result = await detectErrors.mutateAsync({
        imageHash: 'test-hash-' + Date.now(),
        coinInfo: {
          keywords: ['doubled', 'die', 'lincoln'],
          category: 'die_error',
          type: 'doubled_die'
        },
        detectionConfig: { min_confidence: 0.5 }
      });
      
      // Properly handle Json type from Supabase RPC
      let errorsDetected: any[] = [];
      if (result && typeof result === 'object' && 'errors_detected' in result) {
        const detectedErrors = (result as any).errors_detected;
        errorsDetected = Array.isArray(detectedErrors) ? detectedErrors : [];
      }
      
      toast({
        title: "AI Detection Test Complete",
        description: `Detected ${errorsDetected.length} potential errors`,
      });
    } catch (error) {
      console.error('Detection test failed:', error);
    }
  };

  const handleTestValuation = async () => {
    if (filteredEntries.length === 0) return;
    
    try {
      const firstEntry = filteredEntries[0];
      const result = await calculateValue.mutateAsync({
        errorId: firstEntry.id,
        grade: 'MS-65',
        baseCoinValue: 100
      });
      
      toast({
        title: "AI Valuation Test Complete",
        description: `Estimated value calculated for ${firstEntry.error_name}`,
      });
    } catch (error) {
      console.error('Valuation test failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Enhanced Error Coins Knowledge Base
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleTestDetection}
                disabled={detectErrors.isPending}
                variant="outline"
                size="sm"
              >
                <Microscope className="h-4 w-4 mr-2" />
                Test AI Detection
              </Button>
              <Button
                onClick={handleTestValuation}
                disabled={calculateValue.isPending || filteredEntries.length === 0}
                variant="outline"
                size="sm"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Test AI Valuation
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {knowledgeEntries?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {knowledgeEntries?.filter(e => (e.rarity_score || 0) >= 8).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Ultra Rare</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {knowledgeEntries?.filter(e => (e.detection_difficulty || 0) >= 8).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Hard to Detect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {knowledgeEntries?.filter(e => (e.market_premium_multiplier || 0) > 5).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">High Premium</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Knowledge Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Knowledge Entries ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>AI Markers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{entry.error_name}</div>
                      {entry.detection_keywords && entry.detection_keywords.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {entry.detection_keywords.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {entry.detection_keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.detection_keywords.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.error_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.error_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRarityColor(entry.rarity_score)}>
                      {entry.rarity_score || 0}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(entry.detection_difficulty)}>
                      {entry.detection_difficulty || 0}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      {entry.market_premium_multiplier ? `${entry.market_premium_multiplier}x` : 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {entry.ai_detection_markers && Object.keys(entry.ai_detection_markers).length > 0 ? (
                        <Brain className="h-4 w-4 text-purple-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                      )}
                      {entry.visual_markers && Object.keys(entry.visual_markers).length > 0 && (
                        <Eye className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedErrorKnowledgeManager;
