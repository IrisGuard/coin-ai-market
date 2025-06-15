
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import TokenIcon from '../TokenIcon';

interface LockingFormProps {
  optionId: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onLock: () => void;
  benefitPercentage: number;
  isLoading: boolean;
  isUserLoggedIn: boolean;
}

export const LockingForm = ({ 
  optionId, 
  amount, 
  onAmountChange, 
  onLock, 
  benefitPercentage,
  isLoading,
  isUserLoggedIn
}: LockingFormProps) => {
  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <Label
        htmlFor={`lock-amount-${optionId}`}
        className="font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent flex items-center gap-2 text-base animate-glow"
      >
        Amount to Lock <span className="text-xs bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">(GCAI)</span>
        <TokenIcon size={18} className="ml-1" />
      </Label>
      <div className="relative w-full max-w-[180px]">
        <Input
          id={`lock-amount-${optionId}`}
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => onAmountChange(e.target.value)}
          className="
            text-lg font-extrabold pr-12 py-3 pl-4
            shadow-lg border-2 border-[#00d4ff]/60 focus:border-[#00d4ff] focus:shadow-[0_0_25px_#00d4ff80]
            glass-card bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10
            rounded-xl 
            transition-all duration-300
            outline-none
            animate-glow
          "
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <TokenIcon size={20} />
        </span>
      </div>
      {amount && parseFloat(amount) > 0 && (
        <div className="p-3 glass-card bg-gradient-to-r from-[#00ff88]/20 via-white/90 to-[#0070fa]/20 rounded-xl text-center w-full border-2 border-[#00ff88]/60 flex items-center justify-center gap-2 shadow-lg animate-fade-in">
          <span className="block text-sm font-bold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">Bonus Earned:</span>
          <span className="font-extrabold text-lg bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent flex items-center gap-1 animate-glow">
            {(parseFloat(amount) * benefitPercentage / 100).toFixed(2)}
            <TokenIcon size={16} className="ml-1" /> GCAI
          </span>
        </div>
      )}
      <Button
        onClick={onLock}
        className={`
          w-full h-12 text-base font-extrabold mt-3 transition-all rounded-xl inline-flex items-center justify-center
          bg-gradient-to-r from-[#00d4ff] via-[#0070fa] to-[#7c3aed]
          hover:from-[#00ff88] hover:via-[#00d4ff] hover:to-[#0070fa]
          ${amount ? 'shadow-[0_0_30px_#00d4ff80] scale-105' : 'opacity-80'}
          text-white shadow-xl
          focus:ring-4 focus:ring-[#00d4ff]/50
          hover:scale-110 active:scale-95
          duration-300 animate-glow
          border-2 border-white/30
        `}
        disabled={
          !isUserLoggedIn ||
          isLoading ||
          !amount ||
          parseFloat(amount) <= 0
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing Transaction...
          </span>
        ) : (
          <>
            <TokenIcon size={22} className="mr-2" />
            Lock GCAI Tokens
          </>
        )}
      </Button>
    </div>
  );
};
