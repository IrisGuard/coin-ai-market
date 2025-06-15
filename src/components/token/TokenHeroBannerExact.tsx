
import React, { useState, useEffect } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { toast } from "sonner";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useEnhancedTransakPayment } from "@/hooks/useEnhancedTransakPayment";
import { useQueryClient } from "@tanstack/react-query";
import { CountdownTimer } from "./hero/CountdownTimer";
import { FundraisingProgress } from "./hero/FundraisingProgress";
import { UserWalletInfo } from "./hero/UserWalletInfo";
import { PurchaseTerminal } from "./hero/PurchaseTerminal";

export default function TokenHeroBannerExact() {
  const { data: tokenInfo, isLoading: isTokenInfoLoading } = useTokenInfo();
  const { publicKey, connected, connect, connecting } = useSolanaWallet();
  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance();
  const { createPayment, isLoading: isPaymentLoading } = useEnhancedTransakPayment();
  const queryClient = useQueryClient();

  const [selectedPayment, setSelectedPayment] = useState("CARD");
  const [usdAmount, setUsdAmount] = useState("");
  const [gcaiAmount, setGcaiAmount] = useState("");

  const fallbackSaleEndDate = "2025-03-01T00:00:00Z";
  const saleEndDate = (tokenInfo as any)?.sale_end_date || fallbackSaleEndDate;

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
  
  const currentPrice = tokenInfo?.current_price_usd ? Number(tokenInfo.current_price_usd).toFixed(4) : "--";
  const purchasedGcai = balance?.gcai_balance ?? 0;
  const stakeableGcai = balance?.locked_balance ?? 0;
  const isTokenDeployed = !!tokenInfo?.current_price_usd;

  return (
    <div className="w-full bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10 py-10 px-4 md:px-0 border-b-2 border-[#00d4ff]/30 shadow-lg">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h2 className="font-extrabold text-2xl md:text-3xl mb-2 uppercase tracking-tight bg-gradient-to-r from-[#0070fa] via-[#ff00cc] to-[#00ff88] bg-clip-text text-transparent animate-glow drop-shadow text-center">
          JOIN THE WORLD'S #1 AI COIN PLATFORM
        </h2>
        <p className="text-base md:text-lg font-bold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent text-center mb-6 animate-glow">
          Access premium AI coin recognition, error detection & global marketplace with GCAI tokens
        </p>
        
        <CountdownTimer endDate={saleEndDate} />
        
        <FundraisingProgress raised={raised} target={target} />
        
        <UserWalletInfo 
            purchasedGcai={purchasedGcai} 
            stakeableGcai={stakeableGcai} 
            isBalanceLoading={isBalanceLoading} 
        />
        
        <PurchaseTerminal
            isTokenDeployed={isTokenDeployed}
            isTokenInfoLoading={isTokenInfoLoading}
            isPaymentLoading={isPaymentLoading}
            connected={connected}
            connecting={connecting}
            publicKey={publicKey}
            currentPrice={currentPrice}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            usdAmount={usdAmount}
            setUsdAmount={setUsdAmount}
            gcaiAmount={gcaiAmount}
            handleBuy={handleBuy}
            handleConnectWallet={handleConnectWallet}
        />
      </div>
    </div>
  );
}
