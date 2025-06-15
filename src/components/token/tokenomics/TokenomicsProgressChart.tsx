
import React from "react";
import { Progress } from "@/components/ui/progress";

const fundraisingProgress = 83; // e.g. 83%

export function TokenomicsProgressChart() {
  return (
    <div className="rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 glass-card px-6 py-4 max-w-lg mx-auto relative animate-fade-in">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-[15px] font-semibold tracking-tight bg-gradient-to-r from-[#00d4ff] via-[#ff00cc] to-[#00ff88] bg-clip-text text-transparent animate-glow">
          Fundraising Progress
        </span>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 w-full h-5 rounded-full relative overflow-hidden border-2 border-[#00d4ff]/80 shadow-[0_1.5px_14px_#00d4ff33] bg-[#f0fbff]">
            <div
              className="h-full rounded-full absolute left-0 top-0 transition-all"
              style={{
                width: `${fundraisingProgress}%`,
                background: "linear-gradient(to right, #00d4ff, #7c3aed, #00ff88)",
                boxShadow: "0 0 24px 6px #00d4ff99"
              }}
            />
          </div>
          <span className="text-lg font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00ff88] to-[#ff00cc] bg-clip-text text-transparent">
            {fundraisingProgress}%
          </span>
        </div>
        <div className="text-xs text-[#0070fa]/90 mt-1 font-bold">Goal: 50,000,000 <span className="tracking-tight">GCAI</span></div>
      </div>
    </div>
  );
}
