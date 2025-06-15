
import React from 'react';

export const TokenomicsSection = () => {
  return (
    <section className="w-full bg-bg-secondary py-16 px-4 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-brand-primary mb-3 leading-tight">
            Tokenomics
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Deep dive into the GCAI supply, economics, bonus schedules and utility.
          </p>
        </header>
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Supply Breakdown</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 text-lg text-gray-800">
            <li>
              <span className="font-bold text-brand-primary">40%</span> Public Sale
            </li>
            <li>
              <span className="font-bold text-brand-primary">20%</span> Team & Advisors (vested)
            </li>
            <li>
              <span className="font-bold text-brand-primary">15%</span> Development
            </li>
            <li>
              <span className="font-bold text-brand-primary">15%</span> Marketing
            </li>
            <li>
              <span className="font-bold text-brand-primary">10%</span> Liquidity
            </li>
          </ul>
        </div>
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Bonus Locking Schedule</h3>
          <table className="w-full text-left border rounded-lg overflow-hidden text-base">
            <thead className="bg-brand-primary/10">
              <tr>
                <th className="px-4 py-2">Lock Period</th>
                <th className="px-4 py-2">APY Bonus</th>
                <th className="px-4 py-2">Vesting</th>
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
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Utility</h3>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li>Power premium features and AI recognition on the platform</li>
            <li>Lock tokens to receive platform shares and revenue</li>
            <li>Participate in governance and roadmaps</li>
            <li>Referral & rewards system for users</li>
            <li>Discounted marketplace fees with GCAI</li>
          </ul>
        </div>
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Burn & Vesting</h3>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li>Dynamic burn for every platform use—sustains upward price action</li>
            <li>Team & advisor tokens released linearly over 24 months post-launch</li>
            <li>Liquidity pool locked for minimum 12 months</li>
            <li>All unsold tokens after presale: burned</li>
          </ul>
        </div>
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Vesting & Security</h3>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li>Vesting contract: public, auditable, irreversibly locked</li>
            <li>All bonus APYs tied strictly to lock duration & staking contract</li>
            <li>Strict anti-whale/anti-bot launch policy</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
