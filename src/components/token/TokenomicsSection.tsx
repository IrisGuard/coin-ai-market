
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SupplyChart } from './tokenomics/SupplyChart';
import { TokenomicsBarChart } from './tokenomics/TokenomicsBarChart';
import { TokenomicsProgressChart } from './tokenomics/TokenomicsProgressChart';
import { Badge } from '@/components/ui/badge';

const supplyAllocations = [
  { label: "Public Sale", value: "40%", color: "bg-sky-500" },
  { label: "Team & Advisors (Vested)", value: "20%", color: "bg-blue-500" },
  { label: "Ecosystem & Development", value: "20%", color: "bg-indigo-500" },
  { label: "Marketing & Partnerships", value: "10%", color: "bg-purple-500" },
  { label: "Liquidity & Staking Rewards", value: "10%", color: "bg-pink-500" },
];

const lockingSchedule = [
    { period: "3 Months", apy: "+15% APY", vesting: "No" },
    { period: "6 Months", apy: "+25% APY", vesting: "No" },
    { period: "12 Months", apy: "+40% APY", vesting: "No" },
    { period: "18 Months", apy: "+55% APY", vesting: "Yes" },
    { period: "24 Months", apy: "+70% APY", vesting: "Yes" },
    { period: "36 Months", apy: "+100% APY", vesting: "Yes" },
];

export const TokenomicsSection = () => {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green bg-clip-text text-transparent tracking-tight text-center mb-2 drop-shadow animate-glow">
          TOKENOMICS
        </h2>
        
        {/* Multi-chart row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch md:items-start">
          <div className="flex flex-col gap-5 flex-1 md:max-w-xs items-center">
            <SupplyChart />
            <TokenomicsBarChart />
          </div>
          <div className="flex flex-col gap-5 flex-1 md:max-w-xs items-center">
            <TokenomicsProgressChart />
            <Card className="w-full glass-card shadow-xl border border-blue-100/80 rounded-3xl bg-white/50 max-w-xs mx-auto animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent drop-shadow animate-glow">
                  Supply Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {supplyAllocations.map((item, idx) => (
                    <li key={item.label} className="flex items-center text-base">
                      <span className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></span>
                      <span className="font-semibold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent min-w-[60px] text-lg drop-shadow animate-glow">{item.value}</span>
                      <span className="ml-2 text-text-secondary">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Utility and Vesting cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            <Card className="w-full glass-card shadow-lg border border-blue-100/70 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">GCAI Premium AI Utility</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                        <li><span className="font-semibold">Advanced AI Recognition:</span> Unlock world's most accurate coin identification and error detection system.</li>
                        <li><span className="font-semibold">Premium Market Analytics:</span> Access real-time price aggregation, trend analysis, and portfolio insights.</li>
                        <li><span className="font-semibold">Zero Marketplace Fees:</span> Trade on our global marketplace with significantly reduced transaction costs.</li>
                        <li><span className="font-semibold">High-Yield Staking:</span> Lock tokens for up to 100% APY while supporting platform development.</li>
                        <li><span className="font-semibold">Governance Rights:</span> Vote on key platform decisions and new AI feature developments.</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full glass-card shadow-lg border border-blue-100/70 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">Security & Value Protection</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                        <li><span className="font-semibold">Smart Vesting Schedule:</span> Team tokens locked for 24 months ensuring long-term commitment to platform success.</li>
                        <li><span className="font-semibold">Deflationary Mechanism:</span> Regular token burns from platform fees and unsold presale tokens reduce supply.</li>
                        <li><span className="font-semibold">Audited Smart Contracts:</span> Fully audited Solana-based contracts with locked liquidity for maximum security.</li>
                        <li><span className="font-semibold">Revenue Sharing:</span> Token holders receive portions of platform revenue through staking rewards.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        
        <Card className="w-full glass-card shadow-xl border border-blue-100/80 rounded-3xl mt-6 bg-white/80">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">Premium Staking Rewards</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="glass-card rounded-2xl shadow-lg bg-white/80">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lock Period</TableHead>
                            <TableHead className="text-center">Annual APY Bonus</TableHead>
                            <TableHead className="text-center">Vesting</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lockingSchedule.map((item) => (
                            <TableRow key={item.period}>
                                <TableCell className="font-medium">{item.period}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green text-white border-none shadow-sm px-3 py-2 rounded-full shadow-md animate-glow">
                                    {item.apy}
                                  </Badge>
                                </TableCell>
                                <TableCell>{item.vesting}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </section>
  );
};
