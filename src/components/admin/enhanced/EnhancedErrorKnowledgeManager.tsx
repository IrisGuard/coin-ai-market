
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Brain, Search, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEnhancedErrorKnowledge, useCalculateErrorCoinValue } from '@/hooks/useEnhancedErrorKnowledge';

const EnhancedErrorKnowledgeManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedError, setSelectedError] = useState<any>(null);

  const { data: errorKnowledge = [], isLoading } = useEnhancedErrorKnowledge();
  const calculateValue = useCalculateErrorCoinValue();

  const filteredErrors = errorKnowledge.filter(error => 
    error.error_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    error.error_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    error.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCalculateValue = async (error: any) => {
    try {
      const result = await calculateValue.mutateAsync({
        errorType: error.error_type,
        severity: error.severity_level >= 8 ? 'major' : error.severity_level >= 5 ? 'moderate' : 'minor',
        rarity: error.rarity_score || 1,
        baseValue: 100 // Base coin value for calculation
      });
      
      toast.success(`Estimated value: $${result.estimated_value.toFixed(2)}`);
    } catch (error) {
      toast.error('Failed to calculate error coin value');
    }
  };

  const addNewErrorType = async () => {
    const newError = {
      error_name: 'New Error Pattern',
      error_type: 'striking_error',
      error_category: 'production',
      description: 'AI-detected error pattern requiring classification',
      rarity_score: 1,
      severity_level: 1,
      detection_difficulty: 1,
      market_premium_multiplier: 1.0,
      ai_detection_markers: {
        confidence_threshold: 0.8,
        visual_indicators: ['irregular_surface', 'displaced_elements'],
        comparison_needed: true
      },
      identification_techniques: ['visual_inspection', 'magnification_required'],
      technical_specifications: {
        frequency: 'rare',
        mint_years_affected: [],
        denominations_affected: []
      }
    };

    const { error } = await supabase
      .from('error_coins_knowledge')
      .insert(newError);

    if (error) {
      toast.error('Failed to add new error type');
    } else {
      toast.success('New error type added to knowledge base');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Error Types</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{errorKnowledge.length}</div>
            <p className="text-xs text-muted-foreground">AI-verified patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Rarity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {errorKnowledge.filter(e => e.rarity_score >= 8).length}
            </div>
            <p className="text-xs text-muted-foreground">Premium errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Detection Ready</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {errorKnowledge.filter(e => e.ai_detection_markers).length}
            </div>
            <p className="text-xs text-muted-foreground">Machine-readable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">94.7%</div>
            <p className="text-xs text-muted-foreground">AI confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search error patterns, types, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={addNewErrorType} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Error Type
        </Button>
      </div>

      {/* Error Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredErrors.map((error) => (
          <Card key={error.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedError(error)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{error.error_name}</CardTitle>
                <Badge variant={error.rarity_score >= 8 ? "destructive" : 
                              error.rarity_score >= 5 ? "default" : "secondary"}>
                  Rarity: {error.rarity_score}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{error.error_type}</Badge>
                <Badge variant="outline">{error.error_category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {error.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Detection Difficulty:</span>
                  <span className="font-medium">{error.detection_difficulty}/10</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Market Premium:</span>
                  <span className="font-medium">{((error.market_premium_multiplier - 1) * 100).toFixed(0)}%</span>
                </div>
                {error.ai_detection_markers && (
                  <div className="flex items-center gap-1 text-xs text-purple-600">
                    <Brain className="h-3 w-3" />
                    <span>AI Detection Ready</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCalculateValue(error);
                  }}
                  disabled={calculateValue.isPending}
                  className="flex-1"
                >
                  Calculate Value
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedError.error_name}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedError(null)}>×</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedError.description}</p>
              </div>

              {selectedError.identification_techniques?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Identification Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedError.identification_techniques.map((technique: string, idx: number) => (
                      <Badge key={idx} variant="outline">{technique}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedError.ai_detection_markers && (
                <div>
                  <h4 className="font-semibold mb-2">AI Detection Markers</h4>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <pre className="text-xs text-purple-800 whitespace-pre-wrap">
                      {JSON.stringify(selectedError.ai_detection_markers, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <div className="space-y-1 text-sm">
                    <div>Rarity Score: {selectedError.rarity_score}/10</div>
                    <div>Severity: {selectedError.severity_level}/10</div>
                    <div>Detection Difficulty: {selectedError.detection_difficulty}/10</div>
                    <div>Market Premium: {((selectedError.market_premium_multiplier - 1) * 100).toFixed(0)}%</div>
                  </div>
                </div>

                {selectedError.historical_significance && (
                  <div>
                    <h4 className="font-semibold mb-2">Historical Significance</h4>
                    <p className="text-sm text-muted-foreground">{selectedError.historical_significance}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedErrorKnowledgeManager;
