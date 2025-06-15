
import React from 'react';

export const WhitepaperRoadmapSection = () => {
  return (
    <section className="w-full bg-white py-16 px-4 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-brand-primary mb-3 leading-tight">
            Whitepaper & Roadmap
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our vision for GCAI and how we are building the future of AI-powered numismatic trading.
          </p>
        </header>
        {/* Whitepaper Full Section */}
        <div className="mb-14">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Whitepaper Overview</h3>
          <div className="prose prose-blue max-w-none">
            <h4>1. Mission</h4>
            <p>
              The GCAI platform harnesses advanced AI to deliver instant, accurate, and accessible coin recognition tools for collectors and traders globally.
              Our ecosystem uses the GCAI token to align user incentives, platform sustainability, and revenue sharing transparently.
            </p>
            <h4>2. Utility & Economics</h4>
            <ul>
              <li>Token unlocks premium AI features & marketplace perks</li>
              <li>Locking GCAI yields platform shares and revenue rewards</li>
              <li>Dynamic burn and redistribution model for long-term value</li>
              <li>Community governance & voting</li>
            </ul>
            <h4>3. Technology</h4>
            <p>
              GCAI's core combines machine learning, visual error detection, and scalable blockchain infrastructure, boasting efficiency for mobile and web.
            </p>
            <h4>4. Security</h4>
            <ul>
              <li>Full smart contract audits</li>
              <li>Adaptive anti-fraud detection</li>
              <li>Open bug bounty program</li>
            </ul>
          </div>
        </div>
        {/* Roadmap Full-Width, Stacked */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Roadmap</h3>
          <ol className="relative border-l border-brand-primary/30">
            <li className="mb-12 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg shadow">
                Q1
              </span>
              <div className="pl-3">
                <h4 className="text-lg font-semibold text-brand-primary">Platform Foundation</h4>
                <ul className="list-disc pl-4 text-gray-700 text-base">
                  <li>AI coin recognition system</li>
                  <li>Basic marketplace</li>
                  <li>Error detection algorithms</li>
                  <li>User authentication</li>
                </ul>
              </div>
            </li>
            <li className="mb-12 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg shadow">
                Q2
              </span>
              <div className="pl-3">
                <h4 className="text-lg font-semibold text-brand-primary">Advanced Features</h4>
                <ul className="list-disc pl-4 text-gray-700 text-base">
                  <li>Dealer panel</li>
                  <li>Enhanced AI accuracy</li>
                  <li>Marketplace mobile optimization</li>
                  <li>Advanced search & filters</li>
                </ul>
              </div>
            </li>
            <li className="mb-12 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg shadow">
                Q3
              </span>
              <div className="pl-3">
                <h4 className="text-lg font-semibold text-brand-primary">Token Launch</h4>
                <ul className="list-disc pl-4 text-gray-700 text-base">
                  <li>GCAI token deployment</li>
                  <li>Token locking & rewards</li>
                  <li>Referral program</li>
                  <li>Revenue sharing model</li>
                </ul>
              </div>
            </li>
            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg shadow">
                Q4
              </span>
              <div className="pl-3">
                <h4 className="text-lg font-semibold text-brand-primary">Ecosystem Expansion</h4>
                <ul className="list-disc pl-4 text-gray-700 text-base">
                  <li>Cross-platform integrations</li>
                  <li>Global growth & trading features</li>
                  <li>New partnerships</li>
                  <li>Advanced AI tools</li>
                </ul>
              </div>
            </li>
          </ol>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-base mb-2">
            Have questions? Read our full whitepaper (coming soon).
          </p>
          <a
            href="#"
            className="inline-block text-brand-primary font-semibold hover:underline"
            aria-disabled
          >
            Download Whitepaper (PDF)
          </a>
        </div>
      </div>
    </section>
  );
};
