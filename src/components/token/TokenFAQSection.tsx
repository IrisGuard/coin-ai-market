
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
    <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-slate-50">
        <div className="max-w-4xl w-full">
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight text-center mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Card className="w-full shadow-md border border-gray-200/80">
                <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left font-semibold text-lg">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-text-secondary">
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
