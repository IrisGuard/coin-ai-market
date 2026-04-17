
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const AIPortfolioInsights = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Portfolio Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 text-primary" />
            <p className="text-sm">
              Portfolio insight metrics are temporarily hidden until they are sourced from real portfolio holdings, transactions, and market history.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border p-4">
              <div className="text-sm text-muted-foreground">Portfolio Score</div>
              <div className="text-2xl font-bold text-foreground">—</div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold text-foreground">—</div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-sm text-muted-foreground">Monthly Growth</div>
              <div className="text-2xl font-bold text-foreground">—</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPortfolioInsights;
