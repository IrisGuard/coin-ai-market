import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Star, ArrowUp } from 'lucide-react';

export function WhitepaperSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30">
      <div className="max-w-4xl w-full">
        <Card className="w-full glass-card rounded-3xl shadow-xl border border-electric-blue/20">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent tracking-tight text-center animate-glow">
              A New Era for Coin Collecting
            </CardTitle>
            <CardDescription className="text-center text-lg pt-2 text-text-secondary">
              Discover the technology powering the world's most advanced coin analysis and trading platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-text-secondary leading-relaxed space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <Star className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Technology
                  </span>
                </div>
                <p>
                  Our proprietary AI engine instantly recognizes, grades, and values coins using vast data sources and deep machine learning.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <ArrowUp className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Governance
                  </span>
                </div>
                <p>
                  By holding GCAI, users participate in shaping the platform's future, enjoying perks and community-driven decision-making.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <Star className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Security
                  </span>
                </div>
                <p>
                  Smart contract audits, anti-fraud systems, and open bug bounty ensure the safety of assets and data.
                </p>
              </div>
              <div className="glass-card rounded-2xl shadow-md border border-brand-primary/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green flex items-center justify-center">
                    <ArrowUp className="text-white w-4 h-4" />
                  </span>
                  <span className="text-md font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent">
                    Marketplace
                  </span>
                </div>
                <p>
                  A live, decentralized market with zero listing fees, direct dealer tools, and instant settlement options for all users.
                </p>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button disabled className="shadow-md bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success text-white">
                <Star className="mr-2 h-4 w-4" />
                Whitepaper Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
