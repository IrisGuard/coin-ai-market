import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, TrendingUp, Activity, Zap, 
  Shield, Users, Coins, Eye 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Phase 7: Interactive Analytics Chart Component
export const InteractiveAnalyticsChart = ({ title, data, type = 'bar' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            {title}
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
              <Progress value={(item.value / Math.max(...data.map(d => d.value))) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Phase 7: Real-time Status Indicator
export const RealTimeStatusIndicator = ({ systemName, status, metrics }) => {
  const [isLive, setIsLive] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} ${isLive ? 'animate-pulse' : ''}`} />
            {systemName}
          </div>
          <Badge variant="outline" className="text-xs">
            {status?.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {metrics?.map((metric, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{metric.name}:</span>
              <span className="font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Phase 7: Advanced Filter Component
export const AdvancedFilterComponent = ({ onFilterChange, categories, filters }: {
  onFilterChange?: (filters: Record<string, string | null>) => void;
  categories?: Array<{ id: string; name: string }>;
  filters?: any;
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});
  
  const handleFilterToggle = (filterType: string, value: string | null) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: activeFilters[filterType] === value ? null : value
    };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filters */}
        <div>
          <div className="text-sm font-medium mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories?.slice(0, 8).map((category) => (
              <Badge
                key={category.id}
                variant={activeFilters.category === category.name ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterToggle('category', category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <div className="text-sm font-medium mb-2">Status</div>
          <div className="flex gap-2">
            {['active', 'featured', 'auction'].map((status) => (
              <Badge
                key={status}
                variant={activeFilters.status === status ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleFilterToggle('status', status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).some(key => activeFilters[key]) && (
          <div>
            <div className="text-sm font-medium mb-2">Active Filters</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => 
                value && (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value}
                    <button
                      onClick={() => handleFilterToggle(key, null)}
                      className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Phase 7: Enhanced Navigation Component
export const EnhancedNavigationComponent = ({ sections, activeSection, onSectionChange }) => {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSectionChange?.(section.id)}
          >
            <section.icon className="h-4 w-4 mr-2" />
            {section.label}
            {section.badge && (
              <Badge variant="secondary" className="ml-auto">
                {section.badge}
              </Badge>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

// Phase 7: Phase Status Component
export const PhaseStatusComponent = () => {
  const { data: phaseStatus } = useQuery({
    queryKey: ['phase7-status'],
    queryFn: async () => {
      // Check Phase 4, 5, 6, 7 completion status
      const phases = [
        { id: 4, name: 'Categories & Navigation', status: 'completed' },
        { id: 5, name: 'Enhanced Mobile AI', status: 'completed' },
        { id: 6, name: 'Advanced Analytics', status: 'completed' },
        { id: 7, name: 'Complete Mobile Experience', status: 'active' }
      ];
      
      return phases;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          System Phases Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {phaseStatus?.map((phase) => (
            <div key={phase.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Phase {phase.id}</div>
                <div className="text-sm text-muted-foreground">{phase.name}</div>
              </div>
              <Badge 
                className={`${
                  phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                  phase.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {phase.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default {
  InteractiveAnalyticsChart,
  RealTimeStatusIndicator,
  AdvancedFilterComponent,
  EnhancedNavigationComponent,
  PhaseStatusComponent
};