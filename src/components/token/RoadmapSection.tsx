
import React from 'react';

const roadmapBoxes = [
  {
    title: 'Q1 2024 – Platform Foundation',
    items: [
      'AI coin recognition system',
      'Basic marketplace',
      'Error detection algorithms',
      'User authentication',
    ],
  },
  {
    title: 'Q2 2024 – Advanced Features',
    items: [
      'Dealer Panel',
      'Mobile optimization',
      'Advanced filters & search',
    ],
  },
  {
    title: 'Q3 2024 – Token Launch',
    items: [
      'GCAI token deployment',
      'Token locking & rewards',
      'Referral system',
      'Revenue sharing model',
    ],
  },
  {
    title: 'Q4 2024 – Ecosystem Expansion',
    items: [
      'Cross-platform integrations',
      'New partnerships',
      'AI tools expansion',
    ],
  },
];

export function RoadmapSection() {
  return (
    <section className="flex w-full justify-center py-12 px-2">
      <div className="max-w-[900px] w-full">
        <div className="section-title mb-6 text-3xl font-extrabold text-brand-primary tracking-tight text-center">
          ROADMAP
        </div>
        {roadmapBoxes.map(({ title, items }, i) => (
          <div className="section-box roadmap-box" key={i}>
            <h3 className="font-bold text-[18px] mb-2">{title}</h3>
            <ul className="list-disc pl-4 space-y-2 text-[15px]">
              {items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
