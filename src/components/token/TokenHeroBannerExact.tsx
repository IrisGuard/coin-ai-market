
import React, { useState, useEffect } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { toast } from "sonner";
import { Loader2, ChevronRight, Info, Wallet, DollarSign, ArrowDownUp, Calendar, Gift, Lock, TrendingUp, Coins, Percent } from "lucide-react";

const PAYMENT_METHODS = [
  { label: "SOL", icon: <DollarSign className="w-4 h-4" /> },
  { label: "USDT", icon: <DollarSign className="w-4 h-4" /> },
  { label: "USDC", icon: <DollarSign className="w-4 h-4" /> },
  { label: "CARD", icon: <DollarSign className="w-4 h-4" /> },
];

export default function TokenHeroBannerExact() {
  const { data: tokenInfo, isLoading } = useTokenInfo();
  const { publicKey, connected, connect, connecting } = useSolanaWallet();
  const [selectedPayment, setSelectedPayment] = useState("SOL");
  const [solAmount, setSolAmount] = useState("");
  const [gcaiAmount, setGcaiAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  // Countdown logic
  useEffect(() => {
    if (!tokenInfo?.sale_end_date) return;

    const target = new Date(tokenInfo.sale_end_date).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;
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
  }, [tokenInfo?.sale_end_date]);

  // Amount calculation logic (example: SOL ➔ GCAI)
  useEffect(() => {
    if (!solAmount || !tokenInfo?.sol_rate) {
      setGcaiAmount("");
      return;
    }
    const amt = parseFloat(solAmount);
    if (!isNaN(amt) && amt > 0) {
      setGcaiAmount((amt * Number(tokenInfo.sol_rate)).toLocaleString());
    } else {
      setGcaiAmount("");
    }
  }, [solAmount, tokenInfo?.sol_rate]);

  const handleConnectWallet = async () => {
    await connect();
    toast.success("Wallet connected.");
  };

  const handleBuyWithSol = () => {
    if (!connected) {
      toast.error("Please connect your wallet first.");
    } else {
      // Should trigger the buy logic here – left as stub since backend logic not specified
      toast.info("Purchase with SOL is coming soon!");
    }
  };

  // Data from Supabase or fallback
  const raised = Number(tokenInfo?.amount_raised || 0);
  const target = Number(tokenInfo?.total_raise_target || 1);
  const raisePercent = Math.min((raised / target) * 100, 100);

  const currentPrice = tokenInfo?.current_price_usd ? Number(tokenInfo.current_price_usd).toFixed(3) : "--";
  const purchasedGcai = 0; // This should be fetched per user if available
  const stakeableGcai = 0; // This too

  return (
    <div className="w-full bg-white py-8 px-2 md:px-0 border-b border-gray-200">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="font-bold text-xl md:text-2xl text-blue-900 mb-3 uppercase tracking-tight">
          BUY NOW BEFORE PRICE RISE
        </h2>

        {/* Countdown timer */}
        <div className="flex gap-3 mb-4">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((x) => (
            <div key={x.label} className="flex flex-col items-center bg-gray-800 text-white rounded-md px-4 py-2 min-w-[54px]">
              <span className="text-2xl font-bold">{x.value}</span>
              <span className="text-xs font-semibold uppercase">{x.label}</span>
            </div>
          ))}
        </div>

        {/* USDT Raised */}
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

        {/* Purchased/Stakeable GCAI */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center justify-center bg-gray-100 px-3 py-2 rounded font-medium text-blue-900 text-xs">
            <Info className="w-4 h-4 mr-1 text-blue-400" /> YOUR PURCHASED GCAI = {purchasedGcai}
          </div>
          <div className="flex items-center justify-center bg-gray-100 px-3 py-2 rounded font-medium text-blue-900 text-xs">
            <Info className="w-4 h-4 mr-1 text-blue-400" /> YOUR STAKEABLE GCAI = {stakeableGcai}
          </div>
        </div>

        {/* GCAI Price */}
        <div className="mb-5 text-blue-900 font-bold text-lg">
          1 GCAI = ${currentPrice}
        </div>

        {/* Payment methods */}
        <div className="mb-3 flex w-full justify-center gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.label}
              className={`flex items-center px-4 py-2 rounded border border-blue-200 font-semibold text-blue-900 bg-white hover:bg-blue-50 transition
              ${selectedPayment === method.label ? "ring-2 ring-blue-400 border-blue-400 bg-blue-50" : ""}`}
              onClick={() => setSelectedPayment(method.label)}
              type="button"
            >
              {method.icon}
              <span className="ml-1">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Input fields */}
        <div className="flex flex-col w-full gap-3 mb-4">
          <div className="flex items-center bg-gray-100 rounded px-3 py-2">
            <DollarSign className="w-5 h-5 text-blue-400 mr-2" />
            <input
              className="bg-transparent outline-none border-none w-full text-blue-900 font-semibold"
              type="number"
              min="0"
              step="any"
              placeholder="Pay with SOL"
              value={solAmount}
              onChange={e => setSolAmount(e.target.value)}
              disabled={selectedPayment !== "SOL"}
            />
            <span className="ml-2 text-xs text-blue-900 font-semibold">SOL</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded px-3 py-2">
            <ArrowDownUp className="w-5 h-5 text-blue-400 mr-2" />
            <input
              className="bg-transparent outline-none border-none w-full text-blue-900 font-semibold"
              type="text"
              placeholder="Receive GCAI"
              value={gcaiAmount}
              readOnly
            />
            <span className="ml-2 text-xs text-blue-900 font-semibold">GCAI</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row w-full gap-3">
          <button
            className="w-full md:w-1/2 flex items-center justify-center bg-blue-600 text-white font-semibold rounded py-3 hover:bg-blue-700 transition disabled:bg-gray-200"
            type="button"
            onClick={handleConnectWallet}
            disabled={connected || connecting}
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                {connected ? "Wallet Connected" : "Connect Wallet"}
              </>
            )}
          </button>
          <button
            className="w-full md:w-1/2 flex items-center justify-center bg-blue-400 text-white font-bold rounded py-3 hover:bg-blue-500 transition"
            type="button"
            onClick={handleBuyWithSol}
          >
            <ChevronRight className="w-5 h-5 mr-2" />
            Buy with SOL
          </button>
        </div>
      </div>
    </div>
  );
}
