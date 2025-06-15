
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqItems = [
  {
    question: "What makes GCAI the world's most advanced AI coin platform?",
    answer: "GCAI powers the industry's most sophisticated AI recognition system with 99.7% accuracy across 500,000+ coin varieties. Our platform features real-time error detection, advanced grade prediction, global price aggregation, and professional dealer tools - all accessible through GCAI token ownership."
  },
  {
    question: "How do I access premium AI features with GCAI tokens?",
    answer: "Simply hold GCAI tokens in your wallet to unlock premium features including advanced coin recognition, error detection algorithms, market analytics, reduced marketplace fees, and high-yield staking rewards up to 100% APY."
  },
  {
    question: "What are the benefits of GCAI token locking and staking?",
    answer: "Lock your GCAI tokens for periods from 3 months to 3 years and earn substantial APY rewards (15%-100%). Longer lock periods provide higher returns while supporting platform stability and giving you greater governance voting power."
  },
  {
    question: "Why is GCAI built on Solana blockchain?",
    answer: "Solana provides lightning-fast transaction speeds (50,000+ TPS), minimal fees, and robust security - essential for our real-time AI processing and global marketplace operations. This ensures smooth user experience even during high-volume trading periods."
  },
  {
    question: "How does the global marketplace benefit GCAI holders?",
    answer: "GCAI holders enjoy zero listing fees, reduced transaction costs, priority customer support, access to exclusive dealer auctions, and advanced analytics tools. Our AI-powered price discovery ensures fair market valuations across all listings."
  },
  {
    question: "What happens to unsold tokens and platform fees?",
    answer: "All unsold presale tokens are permanently burned to create deflationary pressure. Additionally, a portion of platform transaction fees are used for regular token burns, continuously reducing supply and supporting long-term value appreciation."
  }
];

export const TokenFAQSection = () => {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-gradient-to-br from-[#00d4ff]/10 via-white/95 to-[#00ff88]/10">
        <div className="max-w-4xl w-full">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#0070fa] via-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent tracking-tight text-center mb-8 animate-glow drop-shadow">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Card className="w-full glass-card rounded-3xl shadow-xl border-2 border-[#00d4ff]/70 bg-gradient-to-br from-white/90 via-white/95 to-white/90 animate-fade-in">
                <CardContent className="p-8">
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border-b border-[#00d4ff]/30">
                            <AccordionTrigger className="text-left font-extrabold text-xl bg-gradient-to-r from-[#0070fa] via-[#7c3aed] to-[#ff00cc] bg-clip-text text-transparent hover:no-underline py-6 animate-glow">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base font-semibold bg-gradient-to-r from-[#0070fa]/80 via-[#00d4ff]/80 to-[#00ff88]/80 bg-clip-text text-transparent pb-6">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    </section>
  );
};
