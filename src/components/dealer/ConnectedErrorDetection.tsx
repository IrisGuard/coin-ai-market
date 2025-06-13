
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, Database, TrendingUp } from 'lucide-react';
import { useRealErrorKnowledge } from '@/hooks/useRealAdminData';

const ConnectedErrorDetection = () => {
  const { data: errorKnowledge = [], isLoading } = useRealErrorKnowledge();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Search className="animate-spin h-6 w-6 text-red-600" />
            <span>Connecting to Error Detection System...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highRarityErrors = errorKnowledge.filter(error => error.rarity_score >= 7);
  const mediumRarityErrors = errorKnowledge.filter(error => error.rarity_score >= 4 && error.rarity_score < 7);
  const commonErrors = errorKnowledge.filter(error => error.rarity_score < 4);

  return (
    <div className="space-y-6">
      {/* Error Knowledge Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Error Detection Knowledge Base ({errorKnowledge.length} Errors)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{highRarityErrors.length}</div>
              <div className="text-sm text-muted-foreground">High Rarity (7-10)</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{mediumRarityErrors.length}</div>
              <div className="text-sm text-muted-foreground">Medium Rarity (4-6)</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{commonErrors.length}</div>
              <div className="text-sm text-muted-foreground">Common (1-3)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Value Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            High-Value Error Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highRarityErrors.slice(0, 5).map((error) => (
              <div key={error.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{error.error_name}</h4>
                  <p className="text-sm text-muted-foreground">{error.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{error.error_category}</Badge>
                    <Badge variant="outline">{error.error_type}</Badge>
                    <Badge variant="destructive">Rarity: {error.rarity_score}/10</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Premium: {error.market_premium_multiplier}x
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Difficulty: {error.detection_difficulty}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Error Categories Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...new Set(errorKnowledge.map(e => e.error_category))].map((category) => {
              const categoryErrors = errorKnowledge.filter(e => e.error_category === category);
              const avgRarity = categoryErrors.reduce((sum, e) => sum + e.rarity_score, 0) / categoryErrors.length;
              
              return (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {categoryErrors.length} known errors
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      Avg Rarity: {avgRarity.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Database className="w-5 h-5" />
            <span className="font-medium">Error Detection System Active</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {errorKnowledge.length} Patterns Loaded
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedErrorDetection;
