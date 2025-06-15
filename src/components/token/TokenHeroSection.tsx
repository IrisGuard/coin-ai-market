
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Wallet, CreditCard } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export const TokenHeroSection = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 16, hours: 12, minutes: 49, seconds: 14 });
  const [solAmount, setSolAmount] = useState('');
  const [gcaiAmount, setGcaiAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('SOL');
  const [purchasedGcai, setPurchasedGcai] = useState(0);
  const [stakedGcai, setStakedGcai] = useState(0);
  
  const { data: tokenInfo } = useTokenInfo();
  const { data: walletData } = useWalletBalance();

  // Mock presale data
  const presaleRaised = 1887550.2;
  const presaleTarget = 2081041;
  const presaleProgress = (presaleRaised / presaleTarget) * 100;
  const gcaiPrice = 0.007825;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle amount conversion
  useEffect(() => {
    if (solAmount && selectedPayment === 'SOL') {
      const solPrice = 100; // Mock SOL price in USD
      const usdValue = parseFloat(solAmount) * solPrice;
      const gcaiTokens = usdValue / gcaiPrice;
      setGcaiAmount(gcaiTokens.toFixed(2));
    } else if (solAmount && (selectedPayment === 'USDT' || selectedPayment === 'USDC')) {
      const gcaiTokens = parseFloat(solAmount) / gcaiPrice;
      setGcaiAmount(gcaiTokens.toFixed(2));
    }
  }, [solAmount, selectedPayment]);

  const connectWallet = (walletType: string) => {
    setIsWalletConnected(true);
    setWalletAddress('7xKX...mN9p');
    console.log(`Connecting to ${walletType} wallet`);
  };

  const handlePurchase = () => {
    console.log('Processing purchase:', { solAmount, gcaiAmount, selectedPayment });
  };

  const paymentMethods = [
    { id: 'SOL', label: 'SOL', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { id: 'USDT', label: 'USDT', color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { id: 'USDC', label: 'USDC', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { id: 'CARD', label: 'ΚΑΡΤΑ', color: 'bg-gradient-to-r from-gray-500 to-gray-600' }
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Countdown Timer Section */}
        <Card className="mb-8 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ΑΓΟΡΑ GCAI ΤΩΡΑ ΠΡΙΝ ΑΥΞΗΣΕΙ ΤΗΝ ΤΙΜΗ
            </h1>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-black/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-sm text-white/80">ΜΕΡΕΣ</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-sm text-white/80">ΩΡΕΣ</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-sm text-white/80">ΛΕΠΤΑ</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-sm text-white/80">ΔΕΥΤ.</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-white mb-2">
                <span>ΑΥΞΗΘΗΚΕ USDT:</span>
                <span>${presaleRaised.toLocaleString()} / ${presaleTarget.toLocaleString()}</span>
              </div>
              <Progress value={presaleProgress} className="h-3" />
            </div>

            <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-full">
              ΜΕΧΡΙ ΤΗΝ ΑΥΞΗΣΗ ΤΙΜΗΣ
            </Button>
          </CardContent>
        </Card>

        {/* Purchase Interface */}
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8">
            {/* Token Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{purchasedGcai}</div>
                <div className="text-gray-600">ΤΟ GCAI ΠΟΥ ΑΓΟΡΑΣΑΤΕ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{stakedGcai}</div>
                <div className="text-gray-600">ΤΟ ΣΤΟΙΧΗΜΑ ΣΑΣ GCAI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">${gcaiPrice}</div>
                <div className="text-gray-600">1 GCAI</div>
              </div>
            </div>

            {/* Payment Method Buttons */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`${method.color} text-white hover:opacity-90 px-6 py-3 rounded-full font-semibold ${
                    selectedPayment === method.id ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  {method.label}
                </Button>
              ))}
            </div>

            {/* Purchase Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Πληρώστε με {selectedPayment}
                </label>
                <Input
                  type="number"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  placeholder="0.00"
                  className="text-lg py-3 px-4 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Λήψη GCAI
                </label>
                <Input
                  type="number"
                  value={gcaiAmount}
                  readOnly
                  placeholder="0.00"
                  className="text-lg py-3 px-4 border-2 border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Wallet Connection */}
            {!isWalletConnected ? (
              <div className="space-y-4">
                <Button
                  onClick={() => connectWallet('Phantom')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 text-lg font-semibold rounded-lg"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  ΣΥΝΔΕΣΗ ΠΟΡΤΟΦΟΛΙΟΥ
                </Button>
                
                <Button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold rounded-lg"
                >
                  ΑΓΟΡΑ ΜΕ SOL
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="text-green-800 font-semibold">
                    Πορτοφόλι Συνδεδεμένο: {walletAddress}
                  </div>
                </div>
                
                <Button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold rounded-lg"
                >
                  ΑΓΟΡΑ {gcaiAmount} GCAI
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-6 space-y-2">
              <p className="text-gray-600">
                Δεν έχετε πορτοφόλι; 
                <a href="#" className="text-blue-600 hover:underline ml-1">Μάθετε πώς</a>
              </p>
              <p className="text-sm text-gray-500">
                Τροφοδοτείται από Solana Web3
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
