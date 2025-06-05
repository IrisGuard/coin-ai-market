
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface CustomSourcesStatsProps {
  sources: CustomSource[];
}

const CustomSourcesStats = ({ sources }: CustomSourcesStatsProps) => {
  if (sources.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Στατιστικά Προσωπικών Πηγών</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{sources.length}</div>
            <div className="text-xs text-muted-foreground">Συνολικές Πηγές</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {sources.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Ενεργές</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {sources.filter(s => s.ai_integration).length}
            </div>
            <div className="text-xs text-muted-foreground">AI Enabled</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {sources.filter(s => s.scraping_enabled).length}
            </div>
            <div className="text-xs text-muted-foreground">Auto-Extract</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomSourcesStats;
