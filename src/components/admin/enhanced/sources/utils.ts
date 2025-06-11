
export interface GeographicSource {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: [number, number];
  reliability: number;
  currency: string;
  specialization: string[];
  errorFocus: boolean;
}

export const transformSourcesForGeographic = (sources: any[]): GeographicSource[] => {
  if (!sources) return [];

  const sourceMapping: Record<string, GeographicSource> = {
    'https://www.ebay.com': {
      id: 'ebay-us',
      name: 'eBay United States',
      country: 'United States',
      region: 'North America',
      coordinates: [-95.7129, 37.0902],
      reliability: 0.92,
      currency: 'USD',
      specialization: ['coins', 'rare_coins', 'error_coins'],
      errorFocus: true
    },
    'https://www.ebay.ca': {
      id: 'ebay-ca',
      name: 'eBay Canada',
      country: 'Canada',
      region: 'North America',
      coordinates: [-106.3468, 56.1304],
      reliability: 0.88,
      currency: 'CAD',
      specialization: ['coins', 'rare_coins'],
      errorFocus: true
    },
    'https://www.ebay.co.uk': {
      id: 'ebay-uk',
      name: 'eBay United Kingdom',
      country: 'United Kingdom',
      region: 'Europe',
      coordinates: [-3.4360, 55.3781],
      reliability: 0.90,
      currency: 'GBP',
      specialization: ['coins', 'british_coins', 'error_coins'],
      errorFocus: true
    },
    'https://www.ebay.de': {
      id: 'ebay-de',
      name: 'eBay Germany',
      country: 'Germany',
      region: 'Europe',
      coordinates: [10.4515, 51.1657],
      reliability: 0.87,
      currency: 'EUR',
      specialization: ['coins', 'german_coins', 'european_coins'],
      errorFocus: true
    },
    'https://www.ebay.fr': {
      id: 'ebay-fr',
      name: 'eBay France',
      country: 'France',
      region: 'Europe',
      coordinates: [2.2137, 46.2276],
      reliability: 0.85,
      currency: 'EUR',
      specialization: ['coins', 'french_coins', 'european_coins'],
      errorFocus: true
    },
    'https://www.ebay.it': {
      id: 'ebay-it',
      name: 'eBay Italy',
      country: 'Italy',
      region: 'Europe',
      coordinates: [12.5674, 41.8719],
      reliability: 0.83,
      currency: 'EUR',
      specialization: ['coins', 'italian_coins', 'ancient_coins'],
      errorFocus: true
    },
    'https://www.ebay.es': {
      id: 'ebay-es',
      name: 'eBay Spain',
      country: 'Spain',
      region: 'Europe',
      coordinates: [-3.7492, 40.4637],
      reliability: 0.82,
      currency: 'EUR',
      specialization: ['coins', 'spanish_coins', 'peseta_coins'],
      errorFocus: true
    },
    'https://www.ebay.nl': {
      id: 'ebay-nl',
      name: 'eBay Netherlands',
      country: 'Netherlands',
      region: 'Europe',
      coordinates: [5.2913, 52.1326],
      reliability: 0.84,
      currency: 'EUR',
      specialization: ['coins', 'dutch_coins', 'european_coins'],
      errorFocus: true
    },
    'https://www.ebay.be': {
      id: 'ebay-be',
      name: 'eBay Belgium',
      country: 'Belgium',
      region: 'Europe',
      coordinates: [4.4699, 50.5039],
      reliability: 0.81,
      currency: 'EUR',
      specialization: ['coins', 'belgian_coins'],
      errorFocus: true
    },
    'https://www.ebay.com.au': {
      id: 'ebay-au',
      name: 'eBay Australia',
      country: 'Australia',
      region: 'Oceania',
      coordinates: [133.7751, -25.2744],
      reliability: 0.86,
      currency: 'AUD',
      specialization: ['coins', 'australian_coins', 'commonwealth_coins'],
      errorFocus: true
    },
    'https://www.ebay.co.jp': {
      id: 'ebay-jp',
      name: 'eBay Japan',
      country: 'Japan',
      region: 'Asia',
      coordinates: [138.2529, 36.2048],
      reliability: 0.84,
      currency: 'JPY',
      specialization: ['coins', 'japanese_coins', 'asian_coins'],
      errorFocus: true
    },
    'https://www.ebay.com.sg': {
      id: 'ebay-sg',
      name: 'eBay Singapore',
      country: 'Singapore',
      region: 'Asia',
      coordinates: [103.8198, 1.3521],
      reliability: 0.80,
      currency: 'SGD',
      specialization: ['coins', 'asian_coins'],
      errorFocus: true
    },
    'https://www.ebay.ie': {
      id: 'ebay-ie',
      name: 'eBay Ireland',
      country: 'Ireland',
      region: 'Europe',
      coordinates: [-8.2439, 53.4129],
      reliability: 0.83,
      currency: 'EUR',
      specialization: ['coins', 'irish_coins', 'celtic_coins'],
      errorFocus: true
    },
    'https://www.ebay.at': {
      id: 'ebay-at',
      name: 'eBay Austria',
      country: 'Austria',
      region: 'Europe',
      coordinates: [14.5501, 47.5162],
      reliability: 0.82,
      currency: 'EUR',
      specialization: ['coins', 'austrian_coins', 'european_coins'],
      errorFocus: true
    },
    'https://www.ebay.ch': {
      id: 'ebay-ch',
      name: 'eBay Switzerland',
      country: 'Switzerland',
      region: 'Europe',
      coordinates: [8.2275, 46.8182],
      reliability: 0.85,
      currency: 'CHF',
      specialization: ['coins', 'swiss_coins'],
      errorFocus: true
    },
    'https://www.ebay.pl': {
      id: 'ebay-pl',
      name: 'eBay Poland',
      country: 'Poland',
      region: 'Europe',
      coordinates: [19.1343, 51.9194],
      reliability: 0.79,
      currency: 'PLN',
      specialization: ['coins', 'polish_coins'],
      errorFocus: true
    }
  };

  return sources
    .map(source => {
      const mapping = sourceMapping[source.base_url];
      if (mapping) {
        return {
          ...mapping,
          reliability: source.reliability_score || mapping.reliability
        };
      }
      return null;
    })
    .filter(Boolean) as GeographicSource[];
};

export const getSourcesByRegion = (sources: GeographicSource[]) => {
  return sources.reduce((acc, source) => {
    if (!acc[source.region]) {
      acc[source.region] = [];
    }
    acc[source.region].push(source);
    return acc;
  }, {} as Record<string, GeographicSource[]>);
};

export const getSourceMetrics = (sources: GeographicSource[]) => {
  const totalSources = sources.length;
  const avgReliability = sources.reduce((sum, s) => sum + s.reliability, 0) / totalSources;
  const errorFocusedSources = sources.filter(s => s.errorFocus).length;
  const uniqueRegions = new Set(sources.map(s => s.region)).size;
  const uniqueCurrencies = new Set(sources.map(s => s.currency)).size;

  return {
    totalSources,
    avgReliability: Math.round(avgReliability * 100) / 100,
    errorFocusedSources,
    uniqueRegions,
    uniqueCurrencies,
    coveragePercentage: Math.round((totalSources / 16) * 100) // 16 is total planned eBay sites
  };
};
