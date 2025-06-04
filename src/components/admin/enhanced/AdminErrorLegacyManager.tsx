
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Upload, Plus } from 'lucide-react';
import { useStaticCoinsDB } from '@/hooks/useDataSources';
import { useErrorLogs } from '@/hooks/useAdminData';

const AdminErrorLegacyManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedErrorType, setSelectedErrorType] = useState('all');
  
  const { data: staticCoins, isLoading: staticLoading } = useStaticCoinsDB();
  const { data: errorLogs, isLoading: errorLoading } = useErrorLogs();

  // Mock error coins data since the table doesn't exist yet
  const mockErrorCoins = [
    {
      id: '1',
      error_type: 'Double Strike',
      error_description: 'Coin struck twice with slight offset',
      base_coin_id: 'coin-1',
      rarity_multiplier: 2.5,
      static_coins_db: {
        name: 'Lincoln Cent',
        year: 1955,
        country: 'USA',
        denomination: '1 Cent'
      }
    },
    {
      id: '2',
      error_type: 'Off Center',
      error_description: 'Coin struck 15% off center',
      base_coin_id: 'coin-2',
      rarity_multiplier: 1.8,
      static_coins_db: {
        name: 'Washington Quarter',
        year: 1965,
        country: 'USA',
        denomination: '25 Cents'
      }
    }
  ];

  const filteredErrorCoins = mockErrorCoins.filter(coin => {
    const matchesSearch = coin.error_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.static_coins_db?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedErrorType === 'all' || coin.error_type === selectedErrorType;
    return matchesSearch && matchesType;
  });

  const errorTypes = ['all', ...Array.from(new Set(mockErrorCoins.map(coin => coin.error_type)))];

  if (staticLoading || errorLoading) {
    return <div className="p-4">Loading error coin data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Error Coin Database</h2>
          <p className="text-muted-foreground">Manage known error coin varieties and their characteristics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Error Type
          </Button>
        </div>
      </div>

      <Tabs defaultValue="error-coins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="error-coins">Error Coins</TabsTrigger>
          <TabsTrigger value="static-db">Static Database</TabsTrigger>
          <TabsTrigger value="system-errors">System Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="error-coins" className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search error coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="h-4 w-4 mt-2 text-muted-foreground" />
              {errorTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedErrorType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedErrorType(type)}
                >
                  {type === 'all' ? 'All Types' : type}
                </Button>
              ))}
            </div>
          </div>

          {/* Error Coins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredErrorCoins.map((coin) => (
              <Card key={coin.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{coin.static_coins_db?.name}</CardTitle>
                    <Badge variant="secondary">{coin.error_type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {coin.static_coins_db?.year} • {coin.static_coins_db?.country}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{coin.error_description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rarity Multiplier:</span>
                    <Badge variant="outline">{coin.rarity_multiplier}x</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredErrorCoins.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No error coins found matching your criteria.
            </div>
          )}
        </TabsContent>

        <TabsContent value="static-db" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Static Coin Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Total coins in static database: {staticCoins?.length || 0}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staticCoins?.slice(0, 6).map((coin) => (
                  <Card key={coin.id} className="p-4">
                    <h4 className="font-semibold">{coin.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {coin.year} • {coin.country}
                    </p>
                    {coin.denomination && (
                      <Badge variant="outline" className="mt-2">
                        {coin.denomination}
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs?.slice(0, 10).map((log) => (
                  <div key={log.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="destructive">{log.error_type}</Badge>
                        <p className="mt-1 text-sm">{log.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminErrorLegacyManager;
