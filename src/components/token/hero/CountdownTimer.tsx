
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

export const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  useEffect(() => {
    const targetDate = new Date(endDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex gap-3 mb-4">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map((x) => (
        <div key={x.label} className="flex flex-col items-center bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] text-white rounded-lg px-4 py-2 min-w-[54px] shadow-lg border-2 border-[#00d4ff]/50 animate-glow">
          <span className="text-2xl font-bold drop-shadow-lg">{x.value}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">{x.label}</span>
        </div>
      ))}
    </div>
  );
};
