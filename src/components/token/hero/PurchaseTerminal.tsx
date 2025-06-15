
import React from 'react';
import { Loader2, ChevronRight, Wallet, DollarSign, ArrowDownUp, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAYMENT_METHODS = [
    { label: "CARD", icon: <CreditCard className="w-4 h-4" /> },
    { label: "SOL", icon: <DollarSign className="w-4 h-4" /> },
    { label: "USDT", icon: <DollarSign className="w-4 h-4" /> },
    { label: "USDC", icon: <DollarSign className="w-4 h-4" /> },
];

interface PurchaseTerminalProps {
    isTokenDeployed: boolean;
    isTokenInfoLoading: boolean;
    isPaymentLoading: boolean;
    connected: boolean;
    connecting: boolean;
    publicKey: string | null;
    currentPrice: string;
    selectedPayment: string;
    setSelectedPayment: (method: string) => void;
    usdAmount: string;
    setUsdAmount: (amount: string) => void;
    gcaiAmount: string;
    handleBuy: () => void;
    handleConnectWallet: () => void;
}

export const PurchaseTerminal = ({
    isTokenDeployed,
    isTokenInfoLoading,
    isPaymentLoading,
    connected,
    connecting,
    publicKey,
    currentPrice,
    selectedPayment,
    setSelectedPayment,
    usdAmount,
    setUsdAmount,
    gcaiAmount,
    handleBuy,
    handleConnectWallet,
}: PurchaseTerminalProps) => {
    return (
        <>
            {/* GCAI Price */}
            <div className="mb-6 text-xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow animate-glow">
                1 GCAI = ${currentPrice}
            </div>
            {/* Payment methods */}
            <div className="mb-4 flex w-full justify-center gap-3">
                {isTokenDeployed ? PAYMENT_METHODS.map((method) => (
                    <button
                        key={method.label}
                        className={`flex items-center px-4 py-3 rounded-xl border-2 font-bold transition-all shadow-lg ${
                            selectedPayment === method.label 
                                ? "bg-gradient-to-r from-[#00d4ff] via-[#0070fa] to-[#7c3aed] text-white border-[#00d4ff] shadow-[0_0_20px_#00d4ff80] scale-105" 
                                : "glass-card bg-gradient-to-r from-white/90 to-white/70 border-[#00d4ff]/50 text-[#0070fa] hover:border-[#00d4ff] hover:shadow-[0_0_15px_#00d4ff60]"
                        }`}
                        onClick={() => setSelectedPayment(method.label)}
                        type="button"
                    >
                        {method.icon}
                        <span className="ml-2 font-extrabold">{method.label}</span>
                    </button>
                )) : <Badge className="bg-gradient-to-r from-[#ff00cc] to-[#7c3aed] text-white font-bold px-4 py-2">Purchasing will be enabled soon</Badge>}
            </div>
            {/* Input fields */}
            <div className="flex flex-col w-full gap-4 mb-5">
                <div className="flex items-center glass-card bg-gradient-to-r from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10 border-2 border-[#00d4ff]/60 rounded-xl px-4 py-3 shadow-lg">
                    <DollarSign className="w-5 h-5 text-[#0070fa] mr-3" />
                    <input
                        className="bg-transparent outline-none border-none w-full font-bold text-[#0070fa] placeholder-[#0070fa]/60"
                        type="number"
                        min="1"
                        step="any"
                        placeholder="Amount to Pay"
                        value={usdAmount}
                        onChange={e => setUsdAmount(e.target.value)}
                        disabled={!isTokenDeployed || isPaymentLoading}
                    />
                    <span className="ml-3 text-sm font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">USD</span>
                </div>
                <div className="flex items-center glass-card bg-gradient-to-r from-[#ff00cc]/10 via-white/95 to-[#7c3aed]/10 border-2 border-[#ff00cc]/60 rounded-xl px-4 py-3 shadow-lg">
                    <ArrowDownUp className="w-5 h-5 text-[#7c3aed] mr-3" />
                    <input
                        className="bg-transparent outline-none border-none w-full font-bold text-[#7c3aed] placeholder-[#7c3aed]/60"
                        type="text"
                        placeholder="You Receive"
                        value={gcaiAmount}
                        readOnly
                    />
                    <span className="ml-3 text-sm font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">GCAI</span>
                </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col md:flex-row w-full gap-4">
                <button
                    className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] text-white font-extrabold rounded-xl py-4 shadow-lg hover:shadow-[0_0_25px_#00d4ff80] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#00d4ff]/50"
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
                            {connected ? `Connected: ${publicKey?.substring(0, 6)}...` : "Connect Wallet"}
                        </>
                    )}
                </button>
                <button
                    className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] text-white font-extrabold rounded-xl py-4 shadow-lg hover:shadow-[0_0_25px_#ff00cc80] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#ff00cc]/50 animate-glow"
                    type="button"
                    onClick={handleBuy}
                    disabled={!isTokenDeployed || isPaymentLoading || isTokenInfoLoading || !usdAmount || parseFloat(usdAmount) <= 0}
                >
                    {isPaymentLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> :
                        <><ChevronRight className="w-5 h-5 mr-2" />
                            Buy with {selectedPayment}</>}
                </button>
            </div>
        </>
    )
}
