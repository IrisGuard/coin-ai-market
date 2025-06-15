
import React from 'react';

const wpBoxes = [
  {
    title: "1. Mission",
    content: (
      <p>
        The GCAI platform leverages advanced AI to provide instant, accurate, and transparent coin recognition tools for collectors and investors globally.
      </p>
    )
  },
  {
    title: "2. Token Utility & Economics",
    content: (
      <ul className="list-disc pl-4 space-y-2">
        <li>GCAI unlocks marketplace & premium AI features</li>
        <li>Revenue-sharing through token locking</li>
        <li>Burn & redistribution model for long-term value</li>
        <li>Community governance</li>
      </ul>
    )
  },
  {
    title: "3. AI Technology",
    content: (
      <p>
        Our system uses machine learning, visual error detection, and scalable blockchain architecture, optimized for mobile and web.
      </p>
    )
  },
  {
    title: "4. Security",
    content: (
      <ul className="list-disc pl-4 space-y-2">
        <li>Smart contract audits</li>
        <li>Anti-fraud detection</li>
        <li>Bug bounty program</li>
      </ul>
    )
  },
];

export function WhitepaperSection() {
  return (
    <section className="flex w-full justify-center py-12 px-2">
      <div className="max-w-[900px] w-full">
        <div className="section-title mb-6 text-3xl font-extrabold text-brand-primary tracking-tight text-center">
          GCAI WHITEPAPER
        </div>
        {wpBoxes.map(({ title, content }, i) => (
          <div className="section-box wp-box" key={i}>
            <h3 className="font-bold text-[18px] mb-2">{title}</h3>
            <div className="text-[15px] text-text-secondary">{content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
