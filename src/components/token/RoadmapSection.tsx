
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Package, Zap } from 'lucide-react';

const roadmapPhases = [
  {
    title: 'Q1-Q2 2024: AI Foundation & Core Platform',
    status: 'Completed',
    icon: <Check className="w-5 h-5 text-[#00ff88]" />,
    items: [
      'Launch of Advanced AI Coin Recognition Engine (99.7% accuracy)',
      'Professional Dealer Panel & Global Marketplace Launch',
      'Mobile-First Platform with Real-Time AI Processing',
      'Secure User Authentication & Multi-Wallet Integration',
    ],
  },
  {
    title: 'Q3 2024: Token Ecosystem & Premium Features',
    status: 'Completed',
    icon: <Check className="w-5 h-5 text-[#00ff88]" />,
    items: [
      'GCAI Token Deployment on Solana Blockchain',
      'High-Yield Token Locking System (up to 100% APY)',
      'Advanced User Dashboard & Referral Rewards Program',
      'Real-Time Data Integration & Performance Analytics',
    ],
  },
  {
    title: 'Q4 2024: AI Enhancement & Global Expansion',
    status: 'In Progress',
    icon: <Package className="w-5 h-5 text-[#0070fa]" />,
    items: [
      'Next-Generation Error Detection & Grade Prediction AI',
      'Multi-Source Price Aggregation & Market Intelligence',
      'Advanced Admin Analytics & Performance Monitoring',
      'Global Partnership Network & Multi-Language Support',
    ],
  },
  {
    title: 'Q1 2025: DAO Governance & Advanced AI Tools',
    status: 'Upcoming',
    icon: <Zap className="w-5 h-5 text-[#ff00cc]" />,
    items: [
      'Full DAO Governance Portal for GCAI Token Holders',
      'Predictive AI Models for Market Trends & Portfolio Analysis',
      'Strategic Integrations with Major Grading Services',
      'Cross-Chain Expansion & Institutional Trading Platform',
    ],
  },
];

export function RoadmapSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-[#00ff88]/10 via-white/95 to-[#ff00cc]/10">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center mb-8 animate-glow">
          DEVELOPMENT ROADMAP
        </h2>
        <div className="grid grid-cols-1 gap-7">
          {roadmapPhases.map(({ title, items, icon, status }) => (
            <div key={title} className="glass-card rounded-3xl shadow-xl border-2 border-[#00d4ff]/70 p-0 bg-gradient-to-br from-white/90 via-white/95 to-white/80 animate-fade-in">
              <div className="flex flex-row items-center justify-between gap-2 py-6 px-8 bg-gradient-to-r from-[#00d4ff]/20 via-white/90 to-[#00ff88]/20 rounded-t-3xl border-b-2 border-[#00d4ff]/30">
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">{title}</h3>
                <div className="flex items-center gap-2 text-sm font-extrabold bg-gradient-to-r from-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent">
                  {icon}
                  <span>{status}</span>
                </div>
              </div>
              <div className="p-8 pt-6">
                <ul className="list-disc pl-5 space-y-3 font-bold bg-gradient-to-r from-[#0070fa] via-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent text-base">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
