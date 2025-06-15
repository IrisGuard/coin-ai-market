
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Gift, TrendingUp, DollarSign, Copy, Settings } from 'lucide-react';
import { useAdminReferralStats } from '@/hooks/useAdminTokenData';

export const ReferralManagement = () => {
  const { data: referralStats } = useAdminReferralStats();

  const topPerformers = referralStats?.referrals?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* Referral Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{referralStats?.metrics?.totalReferrals || 0}</div>
                <div className="text-sm text-gray-600">Total Referrals</div>
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
                <div className="text-2xl font-bold">
                  {referralStats?.metrics?.totalCommissions?.toLocaleString() || 0} GCAI
                </div>
                <div className="text-sm text-gray-600">Total Commissions</div>
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
                <div className="text-2xl font-bold">{referralStats?.metrics?.activeReferrers || 0}</div>
                <div className="text-sm text-gray-600">Active Referrers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">5%</div>
                <div className="text-sm text-gray-600">Commission Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Rate Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Standard Rate</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">5%</span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">VIP Rate (100+ referrals)</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">7%</span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Premium Rate (500+ referrals)</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">10%</span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Referral Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead>Total Referrals</TableHead>
                <TableHead>Commissions Earned</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((referrer, index) => (
                <TableRow key={referrer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">#{index + 1}</span>
                      {index < 3 && <span className="text-yellow-500">🏆</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{referrer.profiles?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{referrer.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {referrer.referral_code}
                      </code>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{referrer.total_referrals || 0}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-green-600">
                        {referrer.total_earned?.toLocaleString() || 0} GCAI
                      </span>
                      <div className="text-sm text-gray-500">
                        ${((referrer.total_earned || 0) * 0.1).toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {((referrer.total_referrals || 0) / Math.max(referrer.clicks || 1, 1) * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        (referrer.total_referrals || 0) >= 100 
                          ? 'bg-purple-100 text-purple-800' 
                          : (referrer.total_referrals || 0) >= 10
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {(referrer.total_referrals || 0) >= 100 ? 'VIP' : 
                       (referrer.total_referrals || 0) >= 10 ? 'Active' : 'Standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Pay Commission
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
