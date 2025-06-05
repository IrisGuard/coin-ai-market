import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ErrorMarketDataManager = () => {
  const { data: errorCoins = [] } = useQuery({
    queryKey: ['error-coins-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  const { data: marketData = [] } = useQuery({
    queryKey: ['error-coins-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select(`
          *,
          knowledge_base:error_coins_knowledge!error_coins_market_data_knowledge_base_id_fkey (
            error_name,
            error_category
          ),
          static_coin:static_coins_db!error_coins_market_data_static_coin_id_fkey (
            name,
            year,
            country
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleCreate = () => {
    console.log('Create new market data');
  };

  const handleEdit = (id: string) => {
    console.log('Edit market data:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete market data:', id);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            {/* <Bug className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorCoins.length}</div>
            <p className="text-xs text-muted-foreground">
              {/* +20.1% from last month */}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Market Value</CardTitle>
            {/* <TrendingUp className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450.89</div>
            <p className="text-xs text-muted-foreground">
              {/* +19% from last month */}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            {/* <Coins className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">322</div>
            <p className="text-xs text-muted-foreground">
              {/* +7% from last month */}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Market Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Error Coin Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Type</TableHead>
                <TableHead>Base Coin</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Market Value Range</TableHead>
                <TableHead>Last Sale</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {data.knowledge_base && typeof data.knowledge_base === 'object' && 'error_name' in data.knowledge_base
                          ? data.knowledge_base.error_name
                          : 'Unknown Error'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {data.knowledge_base && typeof data.knowledge_base === 'object' && 'error_category' in data.knowledge_base
                          ? data.knowledge_base.error_category
                          : 'Unknown Category'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {data.static_coin && typeof data.static_coin === 'object' && 'name' in data.static_coin
                      ? data.static_coin.name
                      : 'Unknown Coin'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{data.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${data.market_value_low} - ${data.market_value_high}</div>
                      <div className="text-muted-foreground">Avg: ${data.market_value_avg}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {data.last_sale_price ? `$${data.last_sale_price}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      data.market_trend === 'up' ? 'default' :
                      data.market_trend === 'down' ? 'destructive' : 'secondary'
                    }>
                      {data.market_trend || 'stable'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button>Add Market Data</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Market Data</DialogTitle>
            <DialogDescription>
              Create new market data entries for error coins.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default ErrorMarketDataManager;
