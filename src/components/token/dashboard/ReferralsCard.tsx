
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
    return (
      <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00ff88]/20 via-white/90 to-[#0070fa]/20 border-2 border-[#00ff88]/70 shadow-xl p-8 animate-fade-in">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-[#00ff88] w-8 h-8" />
        </div>
      </div>
    );
  }
  
  if (!referralData) {
    return (
        <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00ff88]/20 via-white/90 to-[#0070fa]/20 border-2 border-[#00ff88]/70 shadow-xl p-6 animate-fade-in">
            <h3 className="font-extrabold text-xl mb-4 bg-gradient-to-r from-[#0070fa] via-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent animate-glow">Referral Program</h3>
            <p className="text-sm font-semibold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent text-center py-4">You have not joined the referral program yet.</p>
        </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl bg-gradient-to-br from-[#00ff88]/20 via-white/90 to-[#0070fa]/20 border-2 border-[#00ff88]/70 shadow-xl p-6 animate-fade-in">
      <h3 className="font-extrabold text-xl mb-5 bg-gradient-to-r from-[#0070fa] via-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent animate-glow">Your Referrals</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 glass-card bg-gradient-to-r from-white/80 to-white/60 rounded-xl border border-[#00ff88]/40">
          <span className="flex items-center font-bold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">
            <Users className="w-5 h-5 mr-3 text-[#00ff88]" />
            Total Referrals
          </span>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">{referralData.total_referrals}</span>
        </div>
        <div className="flex items-center justify-between p-3 glass-card bg-gradient-to-r from-white/80 to-white/60 rounded-xl border border-[#00d4ff]/40">
          <span className="flex items-center font-bold bg-gradient-to-r from-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent">
            <Gift className="w-5 h-5 mr-3 text-[#00d4ff]" />
            Total Earned
          </span>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent">{Number(referralData.total_earned).toLocaleString()} GCAI</span>
        </div>
        <div className="mt-5">
            <label className="text-sm font-bold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">Your Referral Code</label>
            <div className="relative mt-2">
                <input 
                    type="text" 
                    readOnly 
                    value={referralData.referral_code}
                    className="w-full glass-card bg-gradient-to-r from-[#00ff88]/10 to-[#0070fa]/10 border-2 border-[#00ff88]/60 px-4 py-3 rounded-xl text-center font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent cursor-pointer shadow-lg"
                    onClick={copyToClipboard}
                />
            </div>
             <p className="text-xs font-semibold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent text-center mt-2">Click to copy</p>
        </div>
      </div>
    </div>
  );
};
