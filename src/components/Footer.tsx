import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Twitter, Github, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-surface-1/50 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto container-padding py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary shadow-glow">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold tracking-tight">NovaCoin</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t('footer.tagline', 'Premium AI marketplace for collectible coins, banknotes and bullion.')}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">{t('footer.platform', 'Platform')}</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-primary transition-colors">{t('nav.marketplace')}</Link></li>
            <li><Link to="/auctions" className="hover:text-primary transition-colors">{t('nav.auctions')}</Link></li>
            <li><Link to="/upload" className="hover:text-primary transition-colors">{t('footer.sell', 'Sell coins')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">{t('footer.company', 'Company')}</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.about', 'About')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.support', 'Support')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.terms', 'Terms')}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.privacy', 'Privacy')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">{t('footer.connect', 'Connect')}</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="grid place-items-center w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="GitHub" className="grid place-items-center w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Website" className="grid place-items-center w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="mailto:hello@novacoin.market" aria-label="Email" className="grid place-items-center w-9 h-9 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto container-padding py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NovaCoin. {t('footer.rights', 'All rights reserved.')}</span>
          <span className="font-mono">v3.0 · Neo Fintech Edition</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
