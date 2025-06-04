
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useErrorCoins, useExternalPriceSources, useAIRecognitionCache } from '@/hooks/useEnhancedDataSources';
import { useStaticCoinsDB } from '@/hooks/useDataSources';

const AdminErrorStatsOverview = () => {
  const { data: errorCoins } = useErrorCoins();
  const { data: externalSources } = useExternalPriceSources();
  const { data: aiCache } = useAIRecognitionCache();
  const { data: staticCoins } = useStaticCoinsDB();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Error Coin Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{errorCoins?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Tracked varieties</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{staticCoins?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Reference coins</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AI Recognition Cache</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiCache?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Cached results</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">External Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{externalSources?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Connected sources</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorStatsOverview;
