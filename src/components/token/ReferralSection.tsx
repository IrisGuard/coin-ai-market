
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Copy, Gift, TrendingUp, Loader2 } from 'lucide-react';
import { useReferrals } from '@/hooks/useReferrals';
import { toast } from 'sonner';

export const ReferralSection = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { data: referralData, isLoading } = useReferrals();
  
  const referralCode = referralData?.referral_code;
  const referralLink = referralCode ? `${window.location.origin}/token?ref=${referralCode}` : null;

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success('Referral link copied to clipboard!');
    } else {
      toast.info('Referral system will be available when you connect your wallet.');
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Loading Referral Program...
            </h2>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Referral Program
          </h2>
          <p className="text-xl text-text-secondary">
            Earn {referralData?.commission_rate || 5}% commission on every purchase made through your referral link
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-primary" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {referralLink ? (
                <>
                  <div className="flex items-center gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {copySuccess && (
                    <div className="text-sm text-brand-success">Link copied to clipboard!</div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-brand-primary/10 rounded-lg text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-brand-primary" />
                  <p className="text-sm text-text-secondary">
                    Connect your wallet to generate your unique referral link and start earning commissions
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-brand-primary/10 rounded-lg">
                <div className="text-sm font-semibold text-brand-primary mb-2">How it works:</div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Share your unique referral link</li>
                  <li>• Friends purchase GCAI tokens using your link</li>
                  <li>• You earn {referralData?.commission_rate || 5}% commission in GCAI tokens</li>
                  <li>• No limit on referrals or total earnings</li>
                  <li>• Instant commission payouts to your wallet</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Referral Stats */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-success/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      {referralData?.total_referrals || 0}
                    </div>
                    <div className="text-text-secondary">Total Referrals</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-warning/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-brand-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      {referralData?.total_earned?.toLocaleString() || '0'} GCAI
                    </div>
                    <div className="text-text-secondary">Total Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      {referralData?.commission_rate || 5}%
                    </div>
                    <div className="text-text-secondary">Commission Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-brand-success/10 to-brand-warning/10 rounded-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">Start Earning Today</h3>
            <p className="text-text-secondary mb-4">
              Connect your wallet to get your referral link and start earning {referralData?.commission_rate || 5}% commission on all referred purchases. 
              There's no limit to how much you can earn!
            </p>
            {!referralData && (
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                Connect Wallet to Start
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
