
import React from 'react';
import { useReferrals } from '@/hooks/useReferrals';
import { Users, Gift, Loader2 } from 'lucide-react';
import { toast } from "sonner";


export const ReferralsCard = () => {
  const { data: referralData, isLoading } = useReferrals();

  const copyToClipboard = () => {
    if(referralData?.referral_code) {
        navigator.clipboard.writeText(referralData.referral_code);
        toast.success("Referral code copied to clipboard!");
    }
  }

  if (isLoading) {
    return <div className="section-box flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!referralData) {
    return (
        <div className="section-box">
            <h3 className="font-bold text-[18px] mb-4">Referral Program</h3>
            <p className="text-sm text-text-secondary text-center py-4">You have not joined the referral program yet.</p>
        </div>
    )
  }

  return (
    <div className="section-box">
      <h3 className="font-bold text-[18px] mb-4">Your Referrals</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-text-secondary"><Users className="w-4 h-4 mr-2" />Total Referrals</span>
          <span className="font-bold text-lg">{referralData.total_referrals}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-text-secondary"><Gift className="w-4 h-4 mr-2" />Total Earned</span>
          <span className="font-bold text-lg">{Number(referralData.total_earned).toLocaleString()} GCAI</span>
        </div>
        <div className="mt-4">
            <label className="text-xs text-text-secondary">Your Referral Code</label>
            <div className="relative">
                <input 
                    type="text" 
                    readOnly 
                    value={referralData.referral_code}
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 rounded mt-1 text-center font-mono cursor-pointer"
                    onClick={copyToClipboard}
                />
            </div>
             <p className="text-xs text-text-secondary text-center mt-1">Click to copy</p>
        </div>
      </div>
    </div>
  );
};
