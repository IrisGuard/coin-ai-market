
import * as React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const progressData = [
  { label: "Presale Progress", value: 59, color: "#00d4ff" },
  { label: "Token Distribution", value: 75, color: "#00ff88" },
  { label: "Platform Development", value: 85, color: "#7c3aed" },
];

export function TokenomicsProgressChart() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="glass-card rounded-2xl bg-white shadow-xl border-2 border-[#00d4ff]/70 p-4 animate-fade-in">
        <div className="grid grid-cols-3 gap-3 h-32">
          {progressData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 mb-2">
                <CircularProgressbar
                  value={item.value}
                  text={`${item.value}%`}
                  styles={buildStyles({
                    pathColor: item.color,
                    textColor: item.color,
                    trailColor: `${item.color}20`,
                    backgroundColor: 'transparent',
                    textSize: '20px',
                    pathTransitionDuration: 0.5,
                  })}
                />
              </div>
              <span className="text-xs font-bold text-center bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-3">
          <h3 className="font-extrabold text-sm bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">
            Project Progress
          </h3>
        </div>
      </div>
    </div>
  );
}
