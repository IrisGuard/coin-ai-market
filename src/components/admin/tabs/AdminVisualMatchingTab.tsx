
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Search, 
  Star,
  Image as ImageIcon,
  TrendingUp,
  Target,
  ExternalLink,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminVisualMatchingTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [similarityFilter, setSimilarityFilter] = useState('all');

  // Fetch visual matching data
  const { data: matchingData = [], isLoading } = useQuery({
    queryKey: ['admin-visual-matching'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visual_coin_matches')
        .select(`
          *,
          dual_image_analysis!visual_coin_matches_analysis_id_fkey (
            id,
            analysis_results,
            user_id
          )
        `)
        .order('date_found', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get statistics
  const stats = {
    totalMatches: matchingData.length,
    highSimilarity: matchingData.filter(m => (m.similarity_score || 0) > 0.8).length,
    uniqueSources: [...new Set(matchingData.map(m => m.source_url))].length,
    avgSimilarity: matchingData.length > 0 
      ? Math.round((matchingData.reduce((sum, m) => sum + (m.similarity_score || 0), 0) / matchingData.length) * 100)
      : 0
  };

  const filteredData = matchingData.filter(match => {
    const matchesSearch = !searchTerm || 
      match.source_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (match.coin_details as any)?.grade?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSimilarity = similarityFilter === 'all' || 
      (similarityFilter === 'high' && (match.similarity_score || 0) > 0.8) ||
      (similarityFilter === 'medium' && (match.similarity_score || 0) > 0.5 && (match.similarity_score || 0) <= 0.8) ||
      (similarityFilter === 'low' && (match.similarity_score || 0) <= 0.5);
    
    return matchesSearch && matchesSimilarity;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visual Matching Hub</h2>
          <p className="text-muted-foreground">
            Advanced visual similarity matching results and analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Run New Match
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">Visual matches found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Similarity</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highSimilarity}</div>
            <p className="text-xs text-muted-foreground">Above 80% similar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Sources</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSources}</div>
            <p className="text-xs text-muted-foreground">Different sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Similarity</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSimilarity}%</div>
            <p className="text-xs text-muted-foreground">Average match score</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by source URL or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={similarityFilter}
              onChange={(e) => setSimilarityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Similarity</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (50-80%)</option>
              <option value="low">Low (0-50%)</option>
            </select>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      (match.similarity_score || 0) > 0.8 ? 'default' : 
                      (match.similarity_score || 0) > 0.5 ? 'secondary' : 'destructive'
                    }>
                      {Math.round((match.similarity_score || 0) * 100)}% similar
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={match.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Match image placeholder */}
                  <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Grade:</span>{' '}
                      {(match.coin_details as any)?.grade || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Population:</span>{' '}
                      {(match.coin_details as any)?.population || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Guide Value:</span>{' '}
                      ${(match.price_info as any)?.guide_value || 'N/A'}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {match.source_url}
                  </div>

                  <div className="text-xs text-gray-500">
                    Found: {new Date(match.date_found).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No visual matches found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVisualMatchingTab;
