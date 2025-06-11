
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Search, 
  DollarSign,
  BarChart3,
  Target,
  Globe,
  Calendar,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminMarketIntelligenceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('7d');

  // Fetch market analysis data
  const { data: marketData = [], isLoading } = useQuery({
    queryKey: ['admin-market-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analysis_results')
        .select(`
          *,
          dual_image_analysis!market_analysis_results_analysis_id_fkey (
            id,
            analysis_results,
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get statistics
  const stats = {
    totalAnalyses: marketData.length,
    avgValue: marketData.length > 0 
      ? Math.round(marketData.reduce((sum, m) => 
          sum + ((m.current_market_value as any)?.average || 0), 0) / marketData.length)
      : 0,
    bullishTrends: marketData.filter(m => 
      (m.price_trends as any)?.trend === 'rising').length,
    recommendations: marketData.filter(m => 
      m.investment_recommendation?.includes('Buy')).length
  };

  const filteredData = marketData.filter(analysis => {
    const matchesSearch = !searchTerm || 
      analysis.investment_recommendation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.market_outlook?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
          <h2 className="text-2xl font-bold">Market Intelligence Center</h2>
          <p className="text-muted-foreground">
            Advanced market analysis, trends, and investment insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">Market evaluations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgValue}</div>
            <p className="text-xs text-muted-foreground">Market average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bullish Trends</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bullishTrends}</div>
            <p className="text-xs text-muted-foreground">Rising trends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buy Signals</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recommendations}</div>
            <p className="text-xs text-muted-foreground">Buy recommendations</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by recommendation or outlook..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            {filteredData.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      analysis.investment_recommendation?.includes('Buy') ? 'default' :
                      analysis.investment_recommendation?.includes('Hold') ? 'secondary' :
                      'destructive'
                    }>
                      {analysis.investment_recommendation?.split(' - ')[0] || 'N/A'}
                    </Badge>
                    <Badge variant="outline">
                      {(analysis.price_trends as any)?.trend || 'stable'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-sm font-medium">Current Value:</span>
                    <div className="text-lg font-bold text-green-600">
                      ${(analysis.current_market_value as any)?.low || 0} - 
                      ${(analysis.current_market_value as any)?.high || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      Avg: ${(analysis.current_market_value as any)?.average || 0}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Recent Sales:</span>
                    <div className="text-lg font-bold">
                      ${(analysis.recent_sales as any)?.avg_price_30d || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(analysis.recent_sales as any)?.volume_30d || 0} sales
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Population:</span>
                    <div className="text-lg font-bold">
                      {(analysis.population_data as any)?.total_graded || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(analysis.population_data as any)?.higher_grades || 0} higher
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Investment Recommendation:</span>
                    <p className="text-sm text-gray-700">
                      {analysis.investment_recommendation}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Market Outlook:</span>
                    <p className="text-sm text-gray-700">
                      {analysis.market_outlook}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No market analysis results found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketIntelligenceTab;
