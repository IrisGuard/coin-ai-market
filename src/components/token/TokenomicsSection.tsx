
import React from 'react';

const supplyAllocations = [
  { label: "Public Sale", value: "40%" },
  { label: "Team & Advisors (vested)", value: "20%" },
  { label: "Marketing", value: "15%" },
  { label: "Development", value: "15%" },
  { label: "Liquidity", value: "10%" },
];

export const TokenomicsSection = () => {
  return (
    <section className="flex w-full justify-center py-12 px-2">
      <div className="max-w-[900px] w-full">
        <div className="section-title mb-6 text-3xl font-extrabold text-brand-primary tracking-tight text-center">
          TOKENOMICS
        </div>

        <div className="section-box tokenomics-box mb-6">
          <h3 className="font-bold text-[18px] mb-2">Supply Allocation</h3>
          <ul className="list-disc pl-4 space-y-2 text-[15px]">
            {supplyAllocations.map((item, i) => (
              <li key={i}>
                <span className="font-semibold text-brand-primary">{item.value}</span> {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="section-box tokenomics-box mb-6">
          <h3 className="font-bold text-[18px] mb-2">Bonus Locking Schedule</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[350px] w-full border text-[15px] rounded-lg overflow-hidden">
              <thead className="bg-brand-primary/10">
                <tr>
                  <th className="px-4 py-2 text-left">Lock Period</th>
                  <th className="px-4 py-2 text-left">APY Bonus</th>
                  <th className="px-4 py-2 text-left">Vesting</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2">3 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+15%</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+25%</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">12 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+40%</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">18 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+55%</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">24 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+70%</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">36 Months</td>
                  <td className="px-4 py-2 font-bold text-brand-success">+100%</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-box tokenomics-box mb-6">
          <h3 className="font-bold text-[18px] mb-2">Utility</h3>
          <p className="text-[15px]">
            GCAI provides access to AI features, premium analytics, staking rewards, DAO governance, and more.
          </p>
        </div>

        <div className="section-box tokenomics-box mb-6">
          <h3 className="font-bold text-[18px] mb-2">Vesting Schedule</h3>
          <p className="text-[15px]">
            Team & advisor tokens vest over 24 months. Marketing and development budgets unlock gradually based on milestones.
          </p>
        </div>

        <div className="section-box tokenomics-box">
          <h3 className="font-bold text-[18px] mb-2">Burn & Security</h3>
          <ul className="list-disc pl-4 space-y-2 text-[15px]">
            <li>Dynamic burn on platform usage for long-term growth</li>
            <li>All bonus APYs tied to lock duration</li>
            <li>Vesting contracts and liquidity locked for maximum security</li>
            <li>All unsold tokens burned after presale</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
