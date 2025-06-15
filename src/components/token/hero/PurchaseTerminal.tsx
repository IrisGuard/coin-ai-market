
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
                            {connected ? `Connected: ${publicKey?.substring(0, 6)}...` : "Connect Wallet"}
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
        </>
    )
}
