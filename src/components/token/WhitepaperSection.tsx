
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function WhitepaperSection() {
  return (
    <section className="flex w-full justify-center py-12 px-4 md:px-2">
      <div className="max-w-4xl w-full">
        <Card className="w-full shadow-md border border-gray-200/80">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-brand-primary tracking-tight text-center">
              A New Era for Coin Collecting
            </CardTitle>
            <CardDescription className="text-center text-lg pt-2 text-text-secondary">
              Discover the technology powering the world's most advanced coin analysis and trading platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-text-secondary leading-relaxed space-y-4">
            <p>
              The GCAI platform revolutionizes the coin collecting industry by merging state-of-the-art Artificial Intelligence with a decentralized, transparent marketplace. Our ecosystem is designed to empower both seasoned collectors and newcomers by providing powerful tools for coin identification, grading, error detection, and valuation.
            </p>
            <p>
              At its core, our platform leverages a proprietary AI engine trained on a massive dataset of coins to deliver instant, accurate analysis from just a photo. This technology, combined with a robust dealer network and a live marketplace, creates a trusted environment for buying, selling, and managing collections.
            </p>
            <p>
              The GCAI token is the key that unlocks the full potential of this ecosystem. It serves as a utility token for accessing premium features, reducing transaction fees, participating in governance, and earning rewards through staking. By holding GCAI, you become an integral part of a community dedicated to bringing transparency, accessibility, and innovation to the timeless hobby of numismatics.
            </p>
            <div className="text-center pt-4">
                <Button disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    Whitepaper Coming Soon
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
