
import React from 'react';

interface FundraisingProgressProps {
    raised: number;
    target: number;
}

export const FundraisingProgress = ({ raised, target }: FundraisingProgressProps) => {
    const raisePercent = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

    return (
        <div className="w-full mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">USDT Raised</span>
                <span className="text-sm font-extrabold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">{raisePercent.toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden border-2 border-[#00d4ff]/60 shadow-lg">
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00d4ff] via-[#0070fa] to-[#00ff88] transition-all duration-500 shadow-[0_0_20px_#00d4ff80]"
                    style={{ width: `${raisePercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm font-bold">
                <span className="bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">{raised.toLocaleString()} USDT</span>
                <span className="bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">{target.toLocaleString()} USDT</span>
            </div>
        </div>
    );
};
