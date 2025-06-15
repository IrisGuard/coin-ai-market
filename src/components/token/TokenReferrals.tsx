
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { Users, Copy, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const TokenReferrals = () => {
  const { data: referralData, isLoading } = useReferrals();
  
  const referralCode = referralData?.referral_code || 'LOADING...';
  const referralLink = `${window.location.origin}/token?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Referral Program</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn 5% commission on every GCAI token purchase made by users you refer. 
          Start building your network and earning passive income today!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{referralData?.total_referrals || 0}</p>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{referralData?.total_earned || 0} GCAI</p>
            <p className="text-sm text-gray-600">Total Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">5%</p>
            <p className="text-sm text-gray-600">Commission Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Referral Code</label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly />
              <Button onClick={copyReferralCode} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Referral Link</label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly />
              <Button onClick={copyReferralLink} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">How it works:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Share your referral code or link with friends</li>
              <li>• They purchase GCAI tokens using your referral</li>
              <li>• You earn 5% commission on their purchase</li>
              <li>• Commissions are automatically added to your wallet</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
