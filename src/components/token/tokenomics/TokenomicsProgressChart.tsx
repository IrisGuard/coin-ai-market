
import React from "react";
import { Progress } from "@/components/ui/progress";

const fundraisingProgress = 83; // e.g. 83%

export function TokenomicsProgressChart() {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-white/80 shadow-xl border border-emerald-100 glass-card px-6 py-4 max-w-lg mx-auto relative animate-fade-in">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-[15px] font-semibold tracking-tight bg-gradient-to-r from-sky-500 via-electric-purple to-emerald-400 bg-clip-text text-transparent animate-glow">
          Fundraising Progress
        </span>
        <div className="flex items-center gap-3 w-full">
          <Progress
            className="rounded-full h-5 bg-white/80 border-2 border-emerald-100 ring-2 ring-electric-blue/10 shadow-md w-full"
            value={fundraisingProgress}
          />
          <span className="text-lg font-bold bg-gradient-to-r from-brand-success via-electric-purple to-brand-primary bg-clip-text text-transparent">
            {fundraisingProgress}%
          </span>
        </div>
        <div className="text-xs text-brand-primary/70 mt-1">Goal: 50,000,000 GCAI</div>
      </div>
    </div>
  );
}
