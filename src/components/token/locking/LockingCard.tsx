
import React from 'react';
import { Lock, Star, ArrowUp } from 'lucide-react';
import { LockingForm } from './LockingForm';

interface LockingCardProps {
  option: any;
  amount: string;
  onAmountChange: (value: string) => void;
  onLock: () => void;
  isLoading: boolean;
  isUserLoggedIn: boolean;
}

const cardGradientBorder =
  "relative bg-gradient-to-br from-[#00d4ff]/20 via-white/95 to-[#00ff88]/20 rounded-3xl shadow-xl border-2 border-[#00d4ff]/70 glass-card p-2 animate-fade-in";
const cardInner =
  "rounded-2xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 p-6 flex flex-col gap-3 h-full backdrop-blur-sm shadow-lg";

export const LockingCard = ({ 
  option, 
  amount, 
  onAmountChange, 
  onLock, 
  isLoading,
  isUserLoggedIn 
}: LockingCardProps) => {
  const getPercentBoxClass = () =>
    "block mx-auto rounded-full px-6 py-4 mb-4 mt-3 shadow-[0_0_30px_#00d4ff80] " +
    "bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] animate-glow " +
    "text-white text-[2.2rem] font-extrabold tracking-tight border-2 border-white/50 " +
    "shadow-xl transform hover:scale-105 transition-all duration-300";

  return (
    <div
      className={`${cardGradientBorder} min-w-[330px] md:min-w-0 md:w-auto`}
      style={{ minHeight: 380 }}
    >
      <div className={`${cardInner} relative z-10`}>
        {/* Premium Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          {option.is_popular && !option.is_maximum && (
            <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold bg-gradient-to-r from-[#ff9500] to-[#ff6b00] text-white shadow-[0_0_15px_#ff950080] animate-glow">
              <Star className="w-3.5 h-3.5 -ml-1" />
              Most Popular
            </span>
          )}
          {option.is_maximum && (
            <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-black shadow-[0_0_15px_#ffd70080] animate-glow">
              <ArrowUp className="w-3.5 h-3.5 -ml-1" />
              Maximum APY
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          {/* Premium Lock Icon */}
          <span className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] shadow-[0_0_25px_#00d4ff80] ring-4 ring-white/30 w-14 h-14 mt-6 animate-glow">
            <Lock className="w-8 h-8 text-white drop-shadow-lg" />
          </span>
          {/* Duration Title */}
          <h4 className="text-2xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent mb-1 tracking-tight mt-4 animate-glow">
            {option.duration_months} Months
          </h4>
          {/* Ultra-Vivid Bonus Percent Box */}
          <span className={getPercentBoxClass()}>
            +{option.benefit_percentage}%
          </span>
          <span className="block text-sm font-extrabold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent mb-4 -mt-2 animate-glow">
            Annual Percentage Yield
          </span>
        </div>
        {/* Premium Input Section */}
        <LockingForm
          optionId={option.id}
          amount={amount}
          onAmountChange={onAmountChange}
          onLock={onLock}
          benefitPercentage={option.benefit_percentage}
          isLoading={isLoading}
          isUserLoggedIn={isUserLoggedIn}
        />
      </div>
    </div>
  );
};
