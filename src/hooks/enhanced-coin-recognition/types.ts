
export interface EnhancedAnalysisResult {
  claude_analysis: any;
  web_discovery_results: any[];
  merged_data: {
    name: string;
    year: number;
    country: string;
    denomination: string;
    composition: string;
    grade: string;
    estimated_value: number;
    market_value: number;
    rarity: string;
    mint?: string;
    diameter?: number;
    weight?: number;
    errors?: string[];
    confidence: number;
    pcgs_number?: string;
    ngc_number?: string;
    population_data?: any;
    recent_sales?: any[];
    market_trend?: string;
  };
  data_sources: string[];
  enrichment_score: number;
}
