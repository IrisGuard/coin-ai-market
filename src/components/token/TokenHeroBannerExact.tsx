
import React, { useState, useEffect } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { toast } from "sonner";
import { Loader2, ChevronRight, Info, Wallet, DollarSign, ArrowDownUp, CreditCard } from "lucide-react";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useEnhancedTransakPayment } from "@/hooks/useEnhancedTransakPayment";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const PAYMENT_METHODS = [
  { label: "CARD", icon: <CreditCard className="w-4 h-4" /> },
  { label: "SOL", icon: <DollarSign className="w-4 h-4" /> },
  { label: "USDT", icon: <DollarSign className="w-4 h-4" /> },
  { label: "USDC", icon: <DollarSign className="w-4 h-4" /> },
];

export default function TokenHeroBannerExact() {
  const { data: tokenInfo, isLoading: isTokenInfoLoading } = useTokenInfo();
  const { publicKey, connected, connect, connecting } = useSolanaWallet();
  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance();
  const { createPayment, isLoading: isPaymentLoading } = useEnhancedTransakPayment();
  const queryClient = useQueryClient();

  const [selectedPayment, setSelectedPayment] = useState("CARD");
  const [usdAmount, setUsdAmount] = useState("");
  const [gcaiAmount, setGcaiAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  // Use fallback placeholder if missing sale_end_date
  const fallbackSaleEndDate = "2025-03-01T00:00:00Z";

  // Countdown logic with fallback
  useEffect(() => {
    const endDate = (tokenInfo && (tokenInfo as any).sale_end_date)
      ? new Date((tokenInfo as any).sale_end_date).getTime()
      : new Date(fallbackSaleEndDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = endDate - now;
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
  }, [tokenInfo]);

  // Amount calculation from USD to GCAI
  useEffect(() => {
    if (!usdAmount || tokenInfo?.current_price_usd === undefined || tokenInfo?.current_price_usd === null) {
      setGcaiAmount("");
      return;
    }
    const amount = parseFloat(usdAmount);
    const price = Number(tokenInfo.current_price_usd);
    if (!isNaN(amount) && amount > 0 && price > 0) {
      setGcaiAmount((amount / price).toLocaleString(undefined, { maximumFractionDigits: 2 }));
    } else {
      setGcaiAmount("");
    }
  }, [usdAmount, tokenInfo?.current_price_usd]);

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast.success("Wallet connected.");
    } catch(e) {
      toast.error("Failed to connect wallet.");
    }
  };

  const handleBuy = async () => {
    if (!connected) {
      toast.error("Please connect your wallet first.");
      return handleConnectWallet();
    }
    const amount = parseFloat(usdAmount);
    if (isNaN(amount) || amount < 1) { // Minimum purchase amount might be $1
        toast.error("Please enter a valid amount (minimum $1).");
        return;
    }

    const cryptoCurrency = selectedPayment === 'CARD' ? 'USDC' : selectedPayment;

    toast.info("Initializing payment...");
    const result = await createPayment({
        orderType: 'coin_purchase',
        coinId: 'GCAI',
        amount: amount,
        currency: 'USD',
        cryptoCurrency: cryptoCurrency,
    });

    if (result?.paymentUrl) {
        const transakWindow = window.open(result.paymentUrl, 'transak-payment', 'width=500,height=700,scrollbars=yes,resizable=yes');
        
        const checkClosed = setInterval(() => {
            if (transakWindow?.closed) {
                clearInterval(checkClosed);
                toast.info("Verifying payment status...");
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
                    queryClient.invalidateQueries({ queryKey: ['token-activity'] });
                    toast.success('Your balance will be updated shortly if the payment was successful.');
                    setUsdAmount('');
                }, 5000);
            }
        }, 1000);
    }
  };
  
  // Data from Supabase or fallback
  const raised = typeof (tokenInfo as any)?.amount_raised === "number" ? (tokenInfo as any).amount_raised : 2950000;
  const target = typeof (tokenInfo as any)?.total_raise_target === "number" ? (tokenInfo as any).total_raise_target : 5000000;
  const raisePercent = Math.min((raised / target) * 100, 100);

  const currentPrice = tokenInfo?.current_price_usd ? Number(tokenInfo.current_price_usd).toFixed(4) : "--";
  const purchasedGcai = balance?.gcai_balance ?? 0;
  const stakeableGcai = balance?.locked_balance ?? 0;
  const isTokenDeployed = !!tokenInfo?.current_price_usd;

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
            <Info className="w-4 h-4 mr-1 text-blue-400" /> 
            {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `YOUR GCAI = ${Number(purchasedGcai).toLocaleString()}`}
          </div>
          <div className="flex items-center justify-center bg-gray-100 px-3 py-2 rounded font-medium text-blue-900 text-xs">
            <Info className="w-4 h-4 mr-1 text-blue-400" />
            {isBalanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `YOUR LOCKED GCAI = ${Number(stakeableGcai).toLocaleString()}`}
          </div>
        </div>
        {/* GCAI Price */}
        <div className="mb-5 text-blue-900 font-bold text-lg">
          1 GCAI = ${currentPrice}
        </div>
        {/* Payment methods */}
        <div className="mb-3 flex w-full justify-center gap-3">
          {isTokenDeployed ? PAYMENT_METHODS.map((method) => (
            <button
              key={method.label}
              className={`flex items-center px-4 py-2 rounded border-2 font-semibold text-blue-900 bg-white hover:bg-blue-50 transition
              ${selectedPayment === method.label ? "ring-2 ring-blue-400 border-blue-400 bg-blue-50" : "border-blue-200"}`}
              onClick={() => setSelectedPayment(method.label)}
              type="button"
            >
              {method.icon}
              <span className="ml-1">{method.label}</span>
            </button>
          )) : <Badge variant="outline">Purchasing will be enabled soon</Badge>}
        </div>
        {/* Input fields */}
        <div className="flex flex-col w-full gap-3 mb-4">
          <div className="flex items-center bg-gray-100 rounded px-3 py-2">
            <DollarSign className="w-5 h-5 text-blue-400 mr-2" />
            <input
              className="bg-transparent outline-none border-none w-full text-blue-900 font-semibold"
              type="number"
              min="1"
              step="any"
              placeholder="Amount to Pay"
              value={usdAmount}
              onChange={e => setUsdAmount(e.target.value)}
              disabled={!isTokenDeployed || isPaymentLoading}
            />
            <span className="ml-2 text-xs text-blue-900 font-semibold">USD</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded px-3 py-2">
            <ArrowDownUp className="w-5 h-5 text-blue-400 mr-2" />
            <input
              className="bg-transparent outline-none border-none w-full text-blue-900 font-semibold"
              type="text"
              placeholder="You Receive"
              value={gcaiAmount}
              readOnly
            />
            <span className="ml-2 text-xs text-blue-900 font-semibold">GCAI</span>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col md:flex-row w-full gap-3">
          <button
            className="w-full md:w-1/2 flex items-center justify-center bg-blue-600 text-white font-semibold rounded py-3 hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                {connected ? `Connected: ${publicKey?.substring(0,6)}...` : "Connect Wallet"}
              </>
            )}
          </button>
          <button
            className="w-full md:w-1/2 flex items-center justify-center bg-blue-400 text-white font-bold rounded py-3 hover:bg-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="button"
            onClick={handleBuy}
            disabled={!isTokenDeployed || isPaymentLoading || isTokenInfoLoading || !usdAmount || parseFloat(usdAmount) <= 0}
          >
            {isPaymentLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> :
            <><ChevronRight className="w-5 h-5 mr-2" />
            Buy with {selectedPayment}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
