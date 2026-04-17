import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, ShieldCheck, Globe2, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useSearchEnhancement } from '@/hooks/useSearchEnhancement';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import CategoryNavigationFix from '@/components/marketplace/CategoryNavigationFix';
import FeaturedCoinsGrid from '@/components/marketplace/FeaturedCoinsGrid';
import AdvancedSearchInterface from '@/components/search/AdvancedSearchInterface';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI recognition',
    desc: 'Front/back analysis, grade prediction, error detection across 171 numismatic sources.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified trust',
    desc: 'Dealer verification, secure payments, and end-to-end auction integrity.',
  },
  {
    icon: Globe2,
    title: 'Global reach',
    desc: 'Multilingual support, regional categories and worldwide collectible trading workflows.',
  },
];

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const { t } = useTranslation();
  const { performSearch } = useSearchEnhancement();

  const { data: homepageStats } = useQuery({
    queryKey: ['homepage-live-stats'],
    queryFn: async () => {
      const [storesResult, coinsResult, countriesResult] = await Promise.all([
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('coins').select('id', { count: 'exact', head: true }),
        supabase.from('coins').select('country'),
      ]);

      const countryCount = new Set(
        (countriesResult.data || [])
          .map((row: { country?: string | null }) => row.country?.trim())
          .filter(Boolean)
      ).size;

      return {
        verifiedDealers: storesResult.count || 0,
        liveListings: coinsResult.count || 0,
        countries: countryCount,
        aiSources: 171,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const stats = [
    { label: 'Verified dealers', value: homepageStats?.verifiedDealers ?? 0 },
    { label: 'Live listings', value: homepageStats?.liveListings ?? 0 },
    { label: 'Countries', value: homepageStats?.countries ?? 0 },
    { label: 'AI sources', value: homepageStats?.aiSources ?? 171 },
  ];

  const handleSearch = (query: string) => {
    try {
      performSearch(query);
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    } catch (error) {
      console.error('Search error:', error);
      window.location.href = '/marketplace';
    }
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-primary/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 w-[36rem] h-[36rem] rounded-full bg-accent/15 blur-[120px]" />

          <div className="relative max-w-7xl mx-auto container-padding pt-20 pb-24">
            <div className="max-w-3xl animate-fade-in-up">
              <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium tracking-wide">
                  {t('home.badge', 'AI numismatic infrastructure')}
                </span>
              </Badge>

              <h1 className="text-display-xl font-semibold tracking-tight mb-6">
                <span className="text-foreground">{t('home.hero.l1', 'A premium marketplace')}</span>
                <br />
                <span className="text-gradient-primary">{t('home.hero.l2', 'for serious collectors.')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                {t('home.hero.sub', 'Discover, authenticate and trade collectible coins, banknotes and bullion from verified dealers worldwide — powered by advanced AI and live auctions.')}
              </p>

              <div className="max-w-3xl">
                <Suspense fallback={<div className="h-14 rounded-xl animate-shimmer" />}>
                  <AdvancedSearchInterface
                    placeholder={t('home.search', 'Search coins, banknotes, bullion…') as string}
                    onSearch={handleSearch}
                    showVoiceSearch
                    showImageSearch
                    showAISearch
                  />
                </Suspense>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/marketplace">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                    {t('home.cta.explore', 'Explore marketplace')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/auctions">
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                    {t('home.cta.auctions', 'See live auctions')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="glass-panel rounded-2xl px-5 py-6">
                  <div className="text-2xl md:text-3xl font-semibold tracking-tight font-mono">{s.value}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto container-padding py-20">
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="grad-border glass-panel rounded-2xl p-6 hover:translate-y-[-2px] transition-transform"
                >
                  <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto container-padding pb-12">
          <Suspense fallback={<div className="h-32 rounded-2xl animate-shimmer" />}>
            <CategoryNavigationFix />
          </Suspense>
        </section>

        <section className="max-w-7xl mx-auto container-padding pb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-h1 font-semibold">{t('home.featured.title', 'Featured listings')}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('home.featured.sub', 'Hand-picked coins from verified dealers worldwide.')}
              </p>
            </div>
            <Link to="/marketplace" className="text-sm text-primary hover:underline gap-1 inline-flex items-center">
              {t('home.featured.all', 'View all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl animate-shimmer" />
                ))}
              </div>
            }
          >
            <FeaturedCoinsGrid />
          </Suspense>
        </section>

        <Footer />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index;
