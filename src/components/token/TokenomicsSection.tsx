
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SupplyChart } from './tokenomics/SupplyChart';
import { TokenomicsBarChart } from './tokenomics/TokenomicsBarChart';
import { TokenomicsProgressChart } from './tokenomics/TokenomicsProgressChart';
import { Badge } from '@/components/ui/badge';

const supplyAllocations = [
  { label: "Public Sale", value: "40%", color: "bg-gradient-to-r from-[#00d4ff] to-[#0070fa]" },
  { label: "Team & Advisors (Vested)", value: "20%", color: "bg-gradient-to-r from-[#7c3aed] to-[#ff00cc]" },
  { label: "Ecosystem & Development", value: "20%", color: "bg-gradient-to-r from-[#00ff88] to-[#00d4ff]" },
  { label: "Marketing & Partnerships", value: "10%", color: "bg-gradient-to-r from-[#ff00cc] to-[#ffd700]" },
  { label: "Liquidity & Staking Rewards", value: "10%", color: "bg-gradient-to-r from-[#ff6600] to-[#ff1744]" },
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
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center mb-2 drop-shadow animate-glow">
          ADVANCED TOKENOMICS
        </h2>
        
        {/* Premium Charts Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch md:items-start">
          <div className="flex flex-col gap-5 flex-1 md:max-w-xs items-center">
            <SupplyChart />
            <TokenomicsBarChart />
          </div>
          <div className="flex flex-col gap-5 flex-1 md:max-w-xs items-center">
            <TokenomicsProgressChart />
            <Card className="w-full glass-card shadow-xl border-2 border-[#00d4ff]/70 rounded-3xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 max-w-xs mx-auto animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow animate-glow">
                  Token Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {supplyAllocations.map((item, idx) => (
                    <li key={item.label} className="flex items-center text-base">
                      <span className={`w-4 h-4 rounded-full mr-3 ${item.color} shadow-lg`}></span>
                      <span className="font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent min-w-[60px] text-lg drop-shadow animate-glow">{item.value}</span>
                      <span className="ml-2 font-bold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Utility and Security Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            <Card className="w-full glass-card shadow-xl border-2 border-[#00d4ff]/70 rounded-3xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">Premium AI Platform Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-3 font-bold bg-gradient-to-r from-[#0070fa] via-[#7c3aed] to-[#00d4ff] bg-clip-text text-transparent">
                        <li><span className="font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#0070fa] bg-clip-text text-transparent">Advanced AI Recognition:</span> Access 99.7% accurate coin identification across 500,000+ varieties with real-time error detection.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">Global Market Intelligence:</span> Real-time price aggregation, predictive analytics, and professional portfolio management tools.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">Zero-Fee Trading:</span> Premium marketplace access with no listing fees and reduced transaction costs worldwide.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#ff00cc] to-[#ffd700] bg-clip-text text-transparent">High-Yield Staking:</span> Lock tokens for up to 100% APY while supporting platform development and AI enhancement.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00ff88] bg-clip-text text-transparent">DAO Governance:</span> Vote on platform evolution, AI model updates, and new feature implementations.</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full glass-card shadow-xl border-2 border-[#ff00cc]/70 rounded-3xl bg-gradient-to-br from-white/90 via-white/95 to-white/80 animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-xl font-extrabold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent animate-glow">Enterprise Security & Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-3 font-bold bg-gradient-to-r from-[#ff00cc] via-[#7c3aed] to-[#0070fa] bg-clip-text text-transparent">
                        <li><span className="font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent">Smart Vesting:</span> Team tokens locked for 24+ months ensuring long-term platform commitment and stability.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">Deflationary Model:</span> Regular token burns from platform fees and unsold presale tokens create scarcity.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">Audited Contracts:</span> Military-grade security with multi-signature wallets and continuous monitoring.</li>
                        <li><span className="font-extrabold bg-gradient-to-r from-[#ffd700] to-[#ff00cc] bg-clip-text text-transparent">Revenue Distribution:</span> Token holders receive platform revenue through high-yield staking rewards.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        
        <Card className="w-full glass-card shadow-xl border-2 border-[#00d4ff]/70 rounded-3xl mt-6 bg-gradient-to-br from-white/90 via-white/95 to-white/80 animate-fade-in">
            <CardHeader>
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent animate-glow">Premium Staking Rewards Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="glass-card rounded-2xl shadow-lg bg-gradient-to-br from-white/90 to-white/80">
                    <TableHeader>
                        <TableRow className="border-b-2 border-[#00d4ff]/30">
                            <TableHead className="font-extrabold text-lg bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">Lock Period</TableHead>
                            <TableHead className="text-center font-extrabold text-lg bg-gradient-to-r from-[#ff00cc] to-[#7c3aed] bg-clip-text text-transparent">Annual Yield Bonus</TableHead>
                            <TableHead className="text-center font-extrabold text-lg bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">Vesting Required</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lockingSchedule.map((item) => (
                            <TableRow key={item.period} className="border-b border-[#00d4ff]/20 hover:bg-gradient-to-r hover:from-[#00d4ff]/10 hover:to-[#00ff88]/10 transition-all">
                                <TableCell className="font-extrabold text-lg bg-gradient-to-r from-[#0070fa] to-[#00d4ff] bg-clip-text text-transparent">{item.period}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className="font-extrabold text-lg bg-gradient-to-r from-[#00d4ff] via-[#0070fa] to-[#7c3aed] text-white border-none shadow-lg px-4 py-2 rounded-full animate-glow">
                                    {item.apy}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center font-bold text-lg bg-gradient-to-r from-[#00ff88] to-[#0070fa] bg-clip-text text-transparent">{item.vesting}</TableCell>
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
