
import React from 'react';

interface FundraisingProgressProps {
    raised: number;
    target: number;
}

export const FundraisingProgress = ({ raised, target }: FundraisingProgressProps) => {
    const raisePercent = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

    return (
        <div className="w-full mb-4">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 font-medium">USDT Raised</span>
                <span className="text-xs text-gray-500 font-semibold">{raisePercent.toFixed(1)}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${raisePercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 font-mono">
                <span>{raised.toLocaleString()} USDT</span>
                <span>{target.toLocaleString()} USDT</span>
            </div>
        </div>
    );
};
