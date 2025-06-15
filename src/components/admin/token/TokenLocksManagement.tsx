
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useAdminTokenLocks } from '@/hooks/useAdminTokenData';

export const TokenLocksManagement = () => {
  const { data: tokenLocks = [] } = useAdminTokenLocks();

  const calculateProgress = (lockDate: string, unlockDate: string) => {
    const start = new Date(lockDate).getTime();
    const end = new Date(unlockDate).getTime();
    const now = Date.now();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatTimeRemaining = (unlockDate: string) => {
    const now = Date.now();
    const unlock = new Date(unlockDate).getTime();
    const diff = unlock - now;
    
    if (diff <= 0) return "Ready to unlock";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const totalLocked = tokenLocks.reduce((sum, lock) => sum + (lock.amount || 0), 0);
  const totalValue = tokenLocks.reduce((sum, lock) => sum + (lock.amount || 0) * 0.1, 0);
  const activeLocks = tokenLocks.filter(lock => lock.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalLocked.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total GCAI Locked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Value Locked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeLocks}</div>
                <div className="text-sm text-gray-600">Active Locks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">15.5%</div>
                <div className="text-sm text-gray-600">Avg APY</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            All Token Locks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>APY</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unlock Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenLocks.map((lock) => (
                <TableRow key={lock.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lock.profiles?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{lock.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {lock.amount?.toLocaleString()} GCAI
                    </div>
                    <div className="text-sm text-gray-500">
                      ${((lock.amount || 0) * 0.1).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lock.duration_months} months
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress 
                        value={calculateProgress(lock.lock_date, lock.unlock_date)} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500">
                        {formatTimeRemaining(lock.unlock_date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      {((lock.duration_months || 3) * 5)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        lock.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {lock.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(lock.unlock_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Unlock className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
