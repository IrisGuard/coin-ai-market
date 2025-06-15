
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Star, ArrowUp, Brain, Shield } from 'lucide-react';

export function WhitepaperSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30">
      <div className="max-w-4xl w-full">
        <Card className="w-full glass-card rounded-3xl shadow-xl border border-electric-blue/20">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent tracking-tight text-center animate-glow">
              The Future of AI-Powered Numismatics
            </CardTitle>
            <CardDescription className="text-center text-lg pt-2 text-text-secondary">
              Revolutionary AI technology meets advanced blockchain infrastructure for the world's most sophisticated coin analysis platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-text-secondary leading-relaxed space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <Brain className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Advanced AI Engine
                  </span>
                </div>
                <p>
                  Our proprietary neural networks deliver 99.7% accuracy in coin identification, featuring real-time error detection, grade prediction, and market valuation across 500,000+ coin varieties.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <ArrowUp className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Global Governance
                  </span>
                </div>
                <p>
                  GCAI holders control platform evolution through decentralized governance, including AI model updates, fee structures, and new feature implementations across our worldwide network.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <Shield className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Enterprise Security
                  </span>
                </div>
                <p>
                  Military-grade encryption, multi-signature wallets, and continuous security audits protect user assets while our advanced fraud detection prevents counterfeit listings.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <Star className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Premium Marketplace
                  </span>
                </div>
                <p>
                  Zero-fee trading for GCAI holders, instant settlement, professional dealer tools, and AI-powered price discovery create the world's most efficient numismatic marketplace.
                </p>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button disabled className="shadow-md bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success text-white">
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
