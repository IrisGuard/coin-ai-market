
export interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const updateMetaTags = (meta: SEOMetaTags) => {
  // Update title
  document.title = meta.title;

  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: meta.description },
    { name: 'keywords', content: meta.keywords || '' },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:image', content: meta.image || '' },
    { property: 'og:url', content: meta.url || window.location.href },
    { property: 'og:type', content: meta.type || 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: meta.image || '' }
  ];

  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  });
};

// SEO data for different pages
export const seoData = {
  home: {
    title: 'CoinAI - AI-Powered Coin Authentication & Marketplace',
    description: 'Professional coin authentication using AI technology. Buy, sell, and authenticate coins with confidence.',
    keywords: 'coin authentication, AI, marketplace, numismatics, coin grading'
  },
  marketplace: {
    title: 'Active Marketplace - CoinAI',
    description: 'Browse authenticated coins from verified dealers. Secure transactions with AI-verified authenticity.',
    keywords: 'coin marketplace, buy coins, sell coins, authenticated coins'
  },
  auctions: {
    title: 'Live Auctions - CoinAI',
    description: 'Participate in live coin auctions with AI-authenticated items. Secure bidding platform.',
    keywords: 'coin auctions, live bidding, rare coins, numismatic auctions'
  },
  admin: {
    title: 'Admin Panel - CoinAI',
    description: 'Administrative dashboard for platform management.',
    keywords: 'admin, dashboard, management'
  }
};

export const generateStructuredData = (type: 'Organization' | 'Product' | 'WebSite', data: any) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  });
  
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};
