import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target, 
  Activity, 
  Search, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

const EnhancedMarketplaceAI = () => {
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);

  // Phase 5: Real AI Search Filters Integration
  const { data: aiSearchFilters } = useQuery({
    queryKey: ['enhanced-ai-search-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_search_filters')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Phase 5: Aggregated Coin Prices for Market Intelligence
  const { data: aggregatedPrices } = useQuery({
    queryKey: ['enhanced-aggregated-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_coin_prices')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000
  });

  // Phase 5: AI Performance Analytics
  const { data: aiPerformanceAnalytics } = useQuery({
    queryKey: ['enhanced-ai-performance-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Phase 5: Automation Rules Integration
  const { data: automationRules } = useQuery({
    queryKey: ['enhanced-automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('execution_count', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Phase 5: AI Commands Integration
  const { data: aiCommands } = useQuery({
    queryKey: ['enhanced-ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  const executeAISearch = async () => {
    if (!aiSearchTerm.trim()) return;
    
    setIsAiSearchActive(true);
    
    try {
      // Log AI search usage
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'ai_search_enhanced',
          page_url: '/marketplace',
          metadata: {
            search_term: aiSearchTerm,
            ai_enabled: true,
            timestamp: new Date().toISOString()
          }
        });

      // Update search filter usage count if it matches existing filter
      const matchingFilter = aiSearchFilters?.find(filter => 
        filter.filter_name.toLowerCase().includes(aiSearchTerm.toLowerCase())
      );

      if (matchingFilter) {
        await supabase
          .from('ai_search_filters')
          .update({ usage_count: (matchingFilter.usage_count || 0) + 1 })
          .eq('id', matchingFilter.id);
      }

      console.log('🔍 Enhanced AI Search executed:', aiSearchTerm);
      
    } catch (error) {
      console.error('❌ AI Search failed:', error);
    } finally {
      setIsAiSearchActive(false);
    }
  };

  const triggerAutomationRule = async (ruleId: string) => {
    try {
      const response = await supabase.rpc('execute_automation_rule', {
        rule_id: ruleId
      });
      
      console.log('🤖 Automation rule executed:', response);
    } catch (error) {
      console.error('❌ Automation rule execution failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase 5: Enhanced AI Search Interface */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Enhanced AI Marketplace Intelligence
            <Badge className="bg-blue-100 text-blue-800">Phase 5 Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="AI-powered smart search..."
              value={aiSearchTerm}
              onChange={(e) => setAiSearchTerm(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && executeAISearch()}
            />
            <Button 
              onClick={executeAISearch}
              disabled={isAiSearchActive}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isAiSearchActive ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* AI Search Suggestions */}
          {aiSearchFilters && aiSearchFilters.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-800">Smart Suggestions</div>
              <div className="flex flex-wrap gap-2">
                {aiSearchFilters.slice(0, 6).map((filter) => (
                  <Button
                    key={filter.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setAiSearchTerm(filter.filter_name)}
                    className="text-xs border-blue-300 hover:bg-blue-100"
                  >
                    {filter.filter_name}
                    <Badge className="ml-1 bg-blue-200 text-blue-700" variant="outline">
                      {filter.usage_count || 0}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phase 5: Real-time Market Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aggregated Prices Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              Market Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aggregatedPrices?.slice(0, 3).map((price) => (
                <div key={price.id} className="flex justify-between text-xs">
                  <span className="truncate">{price.coin_identifier}</span>
                  <span className="font-bold text-green-600">
                    ${price.avg_price}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Performance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              AI Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {aiPerformanceAnalytics?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Active Analyses
              </div>
              {aiPerformanceAnalytics?.slice(0, 2).map((metric) => (
                <div key={metric.id} className="text-xs">
                  <div className="font-medium">{metric.metric_name}</div>
                  <div className="text-blue-600">{metric.metric_value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-600" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {automationRules?.filter(r => r.is_active).length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Active Rules
              </div>
              {automationRules?.slice(0, 2).map((rule) => (
                <Button
                  key={rule.id}
                  variant="outline"
                  size="sm"
                  onClick={() => triggerAutomationRule(rule.id)}
                  className="w-full text-xs"
                >
                  {rule.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Commands Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-purple-600" />
              AI Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {aiCommands?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Available Commands
              </div>
              {aiCommands?.slice(0, 2).map((command) => (
                <div key={command.id} className="text-xs">
                  <div className="font-medium truncate">{command.name}</div>
                  <div className="text-purple-600">{command.category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 5: Enhanced Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Real-time Market Intelligence
            <Badge className="bg-green-100 text-green-800">Live Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Trends */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Price Trends</h4>
              {aggregatedPrices?.slice(0, 4).map((price) => (
                <motion.div
                  key={price.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="text-xs">
                    <div className="font-medium">{price.coin_identifier}</div>
                    <div className="text-gray-500">{price.grade || 'Ungraded'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">${price.avg_price}</div>
                    <div className="text-xs text-gray-500">
                      {price.source_count} sources
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Performance Metrics */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">AI Performance</h4>
              {aiPerformanceAnalytics?.slice(0, 4).map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-blue-50 rounded-lg"
                >
                  <div className="text-xs">
                    <div className="font-medium">{metric.metric_name}</div>
                    <div className="text-blue-600 font-bold">
                      {typeof metric.metric_value === 'number' 
                        ? metric.metric_value.toFixed(2) 
                        : metric.metric_value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Status */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">System Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm">AI Systems: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Cache: {aiSearchFilters?.length || 0} filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Rules: {automationRules?.filter(r => r.is_active).length || 0} active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Commands: {aiCommands?.length || 0} ready</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMarketplaceAI;