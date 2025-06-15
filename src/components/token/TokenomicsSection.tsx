
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SupplyChart } from './tokenomics/SupplyChart';
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
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green bg-clip-text text-transparent tracking-tight text-center mb-8 drop-shadow animate-glow">
          TOKENOMICS
        </h2>
        
        <Card className="w-full glass-card shadow-xl border border-blue-100/80 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent drop-shadow animate-glow">
              Supply Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <ul className="space-y-3">
                {supplyAllocations.map((item) => (
                  <li key={item.label} className="flex items-center text-base">
                    <span className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></span>
                    <span className="font-semibold text-brand-primary min-w-[60px]">{item.value}</span>
                    <span className="text-text-secondary">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <SupplyChart />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="w-full glass-card shadow-lg border border-blue-100/70 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">GCAI Utility</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                        <li><span className="font-semibold">Premium AI Access:</span> Unlock advanced coin recognition, error detection, and market analysis.</li>
                        <li><span className="font-semibold">Reduced Marketplace Fees:</span> Enjoy lower transaction fees when using GCAI on our platform.</li>
                        <li><span className="font-semibold">Staking & Locking Rewards:</span> Lock your tokens to earn high-yield APY bonuses.</li>
                        <li><span className="font-semibold">DAO Governance:</span> Participate in key decisions shaping the future of the platform.</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full glass-card shadow-lg border border-blue-100/70 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">Vesting & Security</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                        <li><span className="font-semibold">Team & Advisor Vesting:</span> Tokens are vested over 24 months with a 6-month cliff to ensure long-term commitment.</li>
                        <li><span className="font-semibold">Burn Mechanism:</span> A portion of platform fees and all unsold tokens are burned to reduce supply and increase value.</li>
                        <li><span className="font-semibold">Locked Liquidity:</span> All initial liquidity is locked to provide maximum security and stability for token holders.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        
        <Card className="w-full glass-card shadow-xl border border-blue-100/80 rounded-3xl mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-brand-success bg-clip-text text-transparent animate-glow">Bonus Locking Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="glass-card rounded-2xl shadow-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lock Period</TableHead>
                            <TableHead className="text-center">APY Bonus</TableHead>
                            <TableHead className="text-center">Vesting</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lockingSchedule.map((item) => (
                            <TableRow key={item.period}>
                                <TableCell className="font-medium">{item.period}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-green text-white border-none shadow-sm px-3 py-2 rounded-full">
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
