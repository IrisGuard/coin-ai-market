
import React from 'react';
import { Loader2, Info } from "lucide-react";

interface UserWalletInfoProps {
    purchasedGcai: number;
    stakeableGcai: number;
    isBalanceLoading: boolean;
}

export const UserWalletInfo = ({ purchasedGcai, stakeableGcai, isBalanceLoading }: UserWalletInfoProps) => {
    return (
        <div className="w-full grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center justify-center bg-gray-100 px-3 py-2 rounded font-medium text-blue-900 text-xs">
                <Info className="w-4 h-4 mr-1 text-blue-400" />
                {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `YOUR GCAI = ${Number(purchasedGcai).toLocaleString()}`}
            </div>
            <div className="flex items-center justify-center bg-gray-100 px-3 py-2 rounded font-medium text-blue-900 text-xs">
                <Info className="w-4 h-4 mr-1 text-blue-400" />
                {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `YOUR LOCKED GCAI = ${Number(stakeableGcai).toLocaleString()}`}
            </div>
        </div>
    );
};
