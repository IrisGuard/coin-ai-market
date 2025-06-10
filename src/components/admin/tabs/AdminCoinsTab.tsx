
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Star, 
  Trash2, 
  Download,
  Grid,
  List,
  Calendar,
  DollarSign,
  Users,
  Coins,
  TrendingUp
} from 'lucide-react';
import { useAdminCoins } from '@/hooks/admin/useAdminCoins';
import { useCoinAnalytics } from '@/hooks/admin/useCoinAnalytics';
import { useBulkCoinOperations } from '@/hooks/admin/useBulkCoinOperations';
import CoinDetailsModal from '../CoinDetailsModal';

const AdminCoinsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const filters = {
    search: searchTerm,
    status: statusFilter,
    category: categoryFilter,
    featured: featuredFilter,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    priceMin: priceRange.min ? Number(priceRange.min) : undefined,
    priceMax: priceRange.max ? Number(priceRange.max) : undefined,
  };

  const { data: coins = [], isLoading } = useAdminCoins(filters);
  const { data: analytics } = useCoinAnalytics();
  const { bulkUpdateStatus, bulkToggleFeature, bulkDelete } = useBulkCoinOperations();

  const handleSelectCoin = (coinId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoins([...selectedCoins, coinId]);
    } else {
      setSelectedCoins(selectedCoins.filter(id => id !== coinId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoins(coins.map(coin => coin.id));
    } else {
      setSelectedCoins([]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedCoins.length === 0) return;

    switch (action) {
      case 'approve':
        bulkUpdateStatus.mutate({ coinIds: selectedCoins, status: 'verified' });
        break;
      case 'reject':
        bulkUpdateStatus.mutate({ coinIds: selectedCoins, status: 'rejected' });
        break;
      case 'feature':
        bulkToggleFeature.mutate({ coinIds: selectedCoins, featured: true });
        break;
      case 'unfeature':
        bulkToggleFeature.mutate({ coinIds: selectedCoins, featured: false });
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedCoins.length} coins?`)) {
          bulkDelete.mutate({ coinIds: selectedCoins });
        }
        break;
    }
    setSelectedCoins([]);
  };

  const openCoinDetails = (coin: any) => {
    setSelectedCoin(coin);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading coins...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totals.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analytics.totals.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics.totals.verified}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics.totals.featured}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <Trash2 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics.totals.rejected}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Coin Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search and Filters Row */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search coins by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="ancient">Ancient</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={featuredFilter === undefined ? '' : featuredFilter.toString()} 
              onValueChange={(value) => setFeaturedFilter(value === '' ? undefined : value === 'true')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price and Date Filters */}
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <Input
                placeholder="Min price"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24"
              />
              <span>-</span>
              <Input
                placeholder="Max price"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-36"
              />
              <span>-</span>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-36"
              />
            </div>
          </div>
        </CardHeader>

        {/* Bulk Actions */}
        {selectedCoins.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">{selectedCoins.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAction('approve')}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                  Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('feature')}>
                  Feature
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('unfeature')}>
                  Unfeature
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        )}

        <CardContent>
          {viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCoins.length === coins.length && coins.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coins.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCoins.includes(coin.id)}
                        onCheckedChange={(checked) => handleSelectCoin(coin.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-12 h-12 object-cover rounded cursor-pointer"
                          onClick={() => openCoinDetails(coin)}
                        />
                        {coin.featured && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium cursor-pointer" onClick={() => openCoinDetails(coin)}>
                      {coin.name}
                    </TableCell>
                    <TableCell>{coin.year}</TableCell>
                    <TableCell>{coin.grade}</TableCell>
                    <TableCell>€{coin.price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          coin.authentication_status === 'verified' ? 'default' :
                          coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {coin.authentication_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {coin.profiles?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {coin.profiles?.email || 'No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openCoinDetails(coin)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {coins.map((coin) => (
                <Card key={coin.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <Checkbox
                        checked={selectedCoins.includes(coin.id)}
                        onCheckedChange={(checked) => handleSelectCoin(coin.id, !!checked)}
                        className="absolute top-2 left-2 z-10"
                      />
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-full aspect-square object-cover rounded"
                        onClick={() => openCoinDetails(coin)}
                      />
                      {coin.featured && (
                        <Star className="absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" onClick={() => openCoinDetails(coin)}>
                        {coin.name}
                      </h3>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{coin.year}</span>
                        <span>{coin.grade}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">€{coin.price}</span>
                        <Badge 
                          variant={
                            coin.authentication_status === 'verified' ? 'default' :
                            coin.authentication_status === 'rejected' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {coin.authentication_status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {coins.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No coins found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coin Details Modal */}
      <CoinDetailsModal
        coin={selectedCoin}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default AdminCoinsTab;
