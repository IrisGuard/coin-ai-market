
import React from 'react';
import { Loader2, Info } from "lucide-react";

interface UserWalletInfoProps {
    purchasedGcai: number;
    stakeableGcai: number;
    isBalanceLoading: boolean;
}

export const UserWalletInfo = ({ purchasedGcai, stakeableGcai, isBalanceLoading }: UserWalletInfoProps) => {
    return (
        <div className="w-full grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center justify-center glass-card bg-gradient-to-r from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 border-2 border-[#00d4ff]/60 px-3 py-3 rounded-xl font-bold shadow-lg">
                <Info className="w-4 h-4 mr-2 text-[#0070fa]" />
                <span className="text-xs bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent font-extrabold">
                    {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#00d4ff]" /> : `YOUR GCAI = ${Number(purchasedGcai).toLocaleString()}`}
                </span>
            </div>
            <div className="flex items-center justify-center glass-card bg-gradient-to-r from-[#ff00cc]/20 via-white/90 to-[#7c3aed]/20 border-2 border-[#ff00cc]/60 px-3 py-3 rounded-xl font-bold shadow-lg">
                <Info className="w-4 h-4 mr-2 text-[#7c3aed]" />
                <span className="text-xs bg-gradient-to-r from-[#7c3aed] via-[#ff00cc] to-[#0070fa] bg-clip-text text-transparent font-extrabold">
                    {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#ff00cc]" /> : `YOUR LOCKED GCAI = ${Number(stakeableGcai).toLocaleString()}`}
                </span>
            </div>
        </div>
    );
};
