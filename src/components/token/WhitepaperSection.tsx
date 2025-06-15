
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Star, ArrowUp, Brain, Shield } from 'lucide-react';

export function WhitepaperSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#ff00cc]/10">
      <div className="max-w-4xl w-full">
        <Card className="w-full glass-card rounded-3xl shadow-xl border-2 border-[#00d4ff]/70 bg-gradient-to-br from-white/90 via-white/95 to-white/80 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center animate-glow">
              The Future of AI-Powered Numismatics
            </CardTitle>
            <CardDescription className="text-center text-lg pt-2 font-bold bg-gradient-to-r from-[#7c3aed] via-[#ff00cc] to-[#0070fa] bg-clip-text text-transparent animate-glow">
              Revolutionary AI technology meets advanced blockchain infrastructure for the world's most sophisticated coin analysis platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base leading-relaxed space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl shadow-lg border-2 border-[#00d4ff]/60 p-5 bg-gradient-to-br from-[#00d4ff]/10 via-white/90 to-[#0070fa]/10 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d4ff] via-[#0070fa] to-[#7c3aed] flex items-center justify-center shadow-lg">
                    <Brain className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">
                    Advanced AI Engine
                  </span>
                </div>
                <p className="font-bold bg-gradient-to-r from-[#0070fa] via-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">
                  Our proprietary neural networks deliver 99.7% accuracy in coin identification, featuring real-time error detection, grade prediction, and market valuation across 500,000+ coin varieties.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-lg border-2 border-[#ff00cc]/60 p-5 bg-gradient-to-br from-[#ff00cc]/10 via-white/90 to-[#7c3aed]/10 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff00cc] via-[#7c3aed] to-[#0070fa] flex items-center justify-center shadow-lg">
                    <ArrowUp className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-extrabold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent animate-glow">
                    Global Governance
                  </span>
                </div>
                <p className="font-bold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent">
                  GCAI holders control platform evolution through decentralized governance, including AI model updates, fee structures, and new feature implementations across our worldwide network.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-lg border-2 border-[#00ff88]/60 p-5 bg-gradient-to-br from-[#00ff88]/10 via-white/90 to-[#00d4ff]/10 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00ff88] via-[#00d4ff] to-[#0070fa] flex items-center justify-center shadow-lg">
                    <Shield className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-extrabold bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent animate-glow">
                    Enterprise Security
                  </span>
                </div>
                <p className="font-bold bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent">
                  Military-grade encryption, multi-signature wallets, and continuous security audits protect user assets while our advanced fraud detection prevents counterfeit listings.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-lg border-2 border-[#ffd700]/60 p-5 bg-gradient-to-br from-[#ffd700]/10 via-white/90 to-[#ff00cc]/10 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffd700] via-[#ff00cc] to-[#7c3aed] flex items-center justify-center shadow-lg">
                    <Star className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-extrabold bg-gradient-to-r from-[#ffd700] via-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent animate-glow">
                    Premium Marketplace
                  </span>
                </div>
                <p className="font-bold bg-gradient-to-r from-[#ffd700] via-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent">
                  Zero-fee trading for GCAI holders, instant settlement, professional dealer tools, and AI-powered price discovery create the world's most efficient numismatic marketplace.
                </p>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button disabled className="shadow-lg bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] text-white font-extrabold px-8 py-4 rounded-xl animate-glow">
                <FileText className="mr-2 h-4 w-4" />
                Technical Whitepaper Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
