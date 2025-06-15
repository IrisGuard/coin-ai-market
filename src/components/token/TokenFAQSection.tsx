
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export const TokenFAQSection = () => {
  const faqItems = [
    {
      question: "What is GCAI Token and what is its purpose?",
      answer: "GCAI (Global Coin AI) is the native utility token of our AI-powered coin recognition platform. It's used for accessing premium features, locking for platform shares, and participating in governance decisions. Token holders benefit from revenue sharing and platform growth."
    },
    {
      question: "How does the token locking mechanism work?",
      answer: "When you lock GCAI tokens, you receive platform ownership shares and earn passive income from platform revenue. The longer you lock (3-36 months), the higher your bonus percentage. Locked tokens cannot be withdrawn until the lock period expires, ensuring platform stability."
    },
    {
      question: "What are the benefits of locking GCAI tokens?",
      answer: "Locking GCAI tokens provides: (1) Platform ownership shares proportional to your lock amount and duration, (2) Passive income from platform revenue distribution, (3) Bonus rewards up to 100% for 36-month locks, (4) Governance voting rights, and (5) Early access to new features."
    },
    {
      question: "How can I purchase GCAI tokens?",
      answer: "You can buy GCAI tokens in two ways: (1) Through our Transak integration using credit card or bank transfer (supports 100+ countries), or (2) By manually sending USDC or SOL to our treasury address. Current rates are 1 USDC = 10 GCAI and 1 SOL = 1000 GCAI."
    },
    {
      question: "What is the referral program and how much can I earn?",
      answer: "Our referral program rewards you with 5% commission in GCAI tokens for every purchase made through your unique referral link. There's no limit on the number of referrals or total earnings. Commissions are automatically credited to your wallet within 24 hours of each referred purchase."
    }
  ];

  return (
    <section className="py-16 px-4 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-brand-primary" />
            <h2 className="text-4xl font-bold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-text-secondary">
            Get answers to common questions about GCAI tokens
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-bg-primary border border-border-custom-primary rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-text-primary hover:text-brand-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary leading-relaxed pt-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-text-secondary">
            Still have questions? Contact our support team at{' '}
            <a href="mailto:support@gcai.app" className="text-brand-primary hover:underline">
              support@gcai.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
