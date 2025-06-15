
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Package } from 'lucide-react';

const roadmapPhases = [
  {
    title: 'Q1-Q2 2024: Foundation & Core Features',
    status: 'Completed',
    icon: <Check className="w-5 h-5 text-green-500" />,
    items: [
      'Launch of AI Coin Recognition Engine (v1)',
      'Development of Dealer Panel & Marketplace V1',
      'Mobile-first Platform Optimization',
      'User Authentication & Profile Management',
    ],
  },
  {
    title: 'Q3 2024: Token Launch & Ecosystem',
    status: 'Completed',
    icon: <Check className="w-5 h-5 text-green-500" />,
    items: [
      'GCAI Token Contract Deployment on Solana',
      'Implementation of Token Locking & APY Rewards',
      'Launch of User Dashboard & Referral System',
      'Real-time Data Integration with Supabase Backend',
    ],
  },
  {
    title: 'Q4 2024: Platform Enhancement',
    status: 'In Progress',
    icon: <Package className="w-5 h-5 text-blue-500" />,
    items: [
      'Advanced AI Error Detection Module',
      'Integration with External Data Sources',
      'Enhanced Admin Panel with Comprehensive Analytics',
      'Live Price Aggregation Engine for Market Data',
    ],
  },
  {
    title: 'Q1 2025: Governance & Expansion',
    status: 'Upcoming',
    icon: <Clock className="w-5 h-5 text-gray-500" />,
    items: [
      'Launch of DAO Governance Portal for Token Holders',
      'Expansion of AI Tools (Market Predictions, Portfolio Analysis)',
      'Strategic Partnerships with Grading Services',
      'Global Marketplace & Multilingual Support',
    ],
  },
];

export function RoadmapSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green bg-clip-text text-transparent tracking-tight text-center mb-8 animate-glow">
          ROADMAP
        </h2>
        <div className="grid grid-cols-1 gap-7">
          {roadmapPhases.map(({ title, items, icon, status }) => (
            <div key={title} className="glass-card rounded-3xl shadow-xl border border-electric-blue/20 p-0">
              <div className="flex flex-row items-center justify-between gap-2 py-6 px-8 bg-gradient-to-r from-brand-primary/10 via-white/90 to-electric-green/10 rounded-t-3xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">{title}</h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                  {icon}
                  <span>{status}</span>
                </div>
              </div>
              <div className="p-8 pt-3">
                <ul className="list-disc pl-5 space-y-2 text-text-secondary text-base">
                  {items.map((item) => (
                    <li key={item} className="font-medium">{item}</li>
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
