
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
    question: "What is the GCAI token?",
    answer: "GCAI is the native utility token of our platform. It's used to access premium AI features, reduce marketplace fees, earn staking rewards, and participate in platform governance."
  },
  {
    question: "How can I buy GCAI tokens?",
    answer: "You can purchase GCAI tokens directly on this page using our secure purchase terminal. We accept various payment methods, including credit/debit cards and major cryptocurrencies like SOL, USDC, and USDT."
  },
  {
    question: "What is token locking?",
    answer: "Token locking allows you to stake your GCAI tokens for a fixed period (e.g., 3, 6, or 12 months) in exchange for a high Annual Percentage Yield (APY) bonus. It's a way to earn passive rewards while supporting the platform's stability."
  },
  {
    question: "Which blockchain is GCAI built on?",
    answer: "GCAI is a token built on the Solana blockchain, known for its high speed, low transaction fees, and robust security."
  },
  {
      question: "What happens to unsold tokens?",
      answer: "To ensure deflationary pressure and reward early supporters, all tokens that remain unsold after the presale period will be permanently burned, reducing the total supply."
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
