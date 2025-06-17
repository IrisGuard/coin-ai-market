import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useEnhancedCoinRecognition = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedAnalysisResult | null>(null);

  const performEnhancedAnalysis = async (imageFile: File): Promise<EnhancedAnalysisResult | null> => {
    try {
      console.log('🚀 Starting Enhanced Coin Analysis Pipeline...');
      
      // Step 1: Claude AI Recognition
      setEnrichmentProgress(20);
      const claudeResult = await analyzeImage(imageFile);
      
      if (!claudeResult) {
        throw new Error('Claude AI analysis failed');
      }

      console.log('✅ Claude analysis completed:', claudeResult.name);
      
      // Step 2: Auto-trigger Web Discovery
      setIsEnriching(true);
      setEnrichmentProgress(40);
      
      const webDiscoveryResults = await triggerWebDiscovery(claudeResult);
      
      setEnrichmentProgress(70);
      
      // Step 3: Merge and Enrich Data
      const mergedData = await mergeAnalysisData(claudeResult, webDiscoveryResults);
      
      setEnrichmentProgress(90);
      
      // Step 4: Save Enhanced Results
      const analysisId = await saveEnhancedResults(mergedData, imageFile);
      
      const enhancedResult: EnhancedAnalysisResult = {
        claude_analysis: claudeResult,
        web_discovery_results: webDiscoveryResults,
        merged_data: mergedData,
        data_sources: extractDataSources(webDiscoveryResults),
        enrichment_score: calculateEnrichmentScore(claudeResult, webDiscoveryResults)
      };

      setEnhancedResult(enhancedResult);
      setEnrichmentProgress(100);
      
      toast.success(
        `🎯 Complete Analysis: ${mergedData.name} - ${Math.round(mergedData.confidence * 100)}% confidence with ${webDiscoveryResults.length} external sources`
      );
      
      return enhancedResult;
      
    } catch (error: any) {
      console.error('❌ Enhanced analysis failed:', error);
      toast.error(`Enhanced analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsEnriching(false);
      setEnrichmentProgress(0);
    }
  };

  const triggerWebDiscovery = async (claudeResult: any) => {
    console.log('🔍 Triggering Web Discovery Engine...');
    
    const searchQueries = generateSearchQueries(claudeResult);
    const sources = ['ebay_global', 'heritage', 'pcgs', 'ngc', 'numista', 'coinworld'];
    
    const { data, error } = await supabase.functions.invoke('web-discovery-engine', {
      body: {
        analysisId: crypto.randomUUID(),
        coinData: {
          name: claudeResult.name,
          year: claudeResult.year,
          country: claudeResult.country,
          denomination: claudeResult.denomination,
          grade: claudeResult.grade,
          composition: claudeResult.composition,
          mint: claudeResult.mint,
          diameter: claudeResult.diameter,
          weight: claudeResult.weight,
          estimated_value: claudeResult.estimatedValue
        },
        sources: sources,
        maxResults: 50,
        searchQueries: searchQueries
      }
    });

    if (error) {
      console.error('Web discovery error:', error);
      return [];
    }

    // Get the actual results from the database
    const { data: results } = await supabase
      .from('web_discovery_results')
      .select('*')
      .eq('analysis_id', data.analysisId)
      .order('coin_match_confidence', { ascending: false });

    return results || [];
  };

  const generateSearchQueries = (claudeResult: any): string[] => {
    const queries = [];
    
    // Basic identification query
    queries.push(`${claudeResult.name} ${claudeResult.year}`);
    
    // Detailed query with country
    queries.push(`${claudeResult.year} ${claudeResult.country} ${claudeResult.denomination}`);
    
    // Grade-specific query
    if (claudeResult.grade) {
      queries.push(`${claudeResult.name} ${claudeResult.year} ${claudeResult.grade}`);
    }
    
    // Mint mark query
    if (claudeResult.mint) {
      queries.push(`${claudeResult.name} ${claudeResult.year} ${claudeResult.mint} mint`);
    }
    
    // Error coin queries
    if (claudeResult.errors && claudeResult.errors.length > 0) {
      claudeResult.errors.forEach((error: string) => {
        queries.push(`${claudeResult.year} ${claudeResult.denomination} ${error} error`);
      });
    }
    
    return queries;
  };

  const mergeAnalysisData = async (claudeResult: any, webResults: any[]) => {
    console.log('🔗 Merging Claude + Web Discovery data...');
    
    // Start with Claude's base analysis
    const mergedData = { ...claudeResult };
    
    if (webResults.length > 0) {
      // Extract market data from web results
      const marketPrices = extractMarketPrices(webResults);
      const technicalSpecs = extractTechnicalSpecs(webResults);
      const gradingData = extractGradingData(webResults);
      const populationData = extractPopulationData(webResults);
      
      // Enhance with real market data (prioritize over AI estimates)
      if (marketPrices.average > 0) {
        mergedData.market_value = marketPrices.average;
        mergedData.estimated_value = Math.max(mergedData.estimated_value, marketPrices.average);
      }
      
      // Enhance technical specifications
      if (technicalSpecs.weight && !mergedData.weight) {
        mergedData.weight = technicalSpecs.weight;
      }
      if (technicalSpecs.diameter && !mergedData.diameter) {
        mergedData.diameter = technicalSpecs.diameter;
      }
      if (technicalSpecs.composition && mergedData.composition === 'Unknown') {
        mergedData.composition = technicalSpecs.composition;
      }
      
      // Enhance grading data
      if (gradingData.pcgs_number) {
        mergedData.pcgs_number = gradingData.pcgs_number;
      }
      if (gradingData.ngc_number) {
        mergedData.ngc_number = gradingData.ngc_number;
      }
      
      // Add population and market trend data
      mergedData.population_data = populationData;
      mergedData.recent_sales = extractRecentSales(webResults);
      mergedData.market_trend = determineMarketTrend(webResults);
      
      // Boost confidence if external data confirms Claude's analysis
      if (confirmAnalysis(claudeResult, webResults)) {
        mergedData.confidence = Math.min(1.0, mergedData.confidence + 0.15);
      }
    }
    
    return mergedData;
  };

  const extractMarketPrices = (webResults: any[]) => {
    const prices = webResults
      .filter(result => result.price_data && result.price_data.current_price)
      .map(result => parseFloat(result.price_data.current_price))
      .filter(price => price > 0);
    
    if (prices.length === 0) return { average: 0, range: { low: 0, high: 0 } };
    
    return {
      average: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      range: {
        low: Math.min(...prices),
        high: Math.max(...prices)
      }
    };
  };

  const extractTechnicalSpecs = (webResults: any[]) => {
    const specs = {
      weight: null as number | null,
      diameter: null as number | null,
      composition: null as string | null
    };
    
    for (const result of webResults) {
      if (result.extracted_data) {
        if (result.extracted_data.weight && !specs.weight) {
          specs.weight = parseFloat(result.extracted_data.weight);
        }
        if (result.extracted_data.diameter && !specs.diameter) {
          specs.diameter = parseFloat(result.extracted_data.diameter);
        }
        if (result.extracted_data.composition && !specs.composition) {
          specs.composition = result.extracted_data.composition;
        }
      }
    }
    
    return specs;
  };

  const extractGradingData = (webResults: any[]) => {
    const gradingData = {
      pcgs_number: null as string | null,
      ngc_number: null as string | null
    };
    
    for (const result of webResults) {
      if (result.source_type === 'pcgs' && result.extracted_data?.certification) {
        gradingData.pcgs_number = result.extracted_data.certification;
      }
      if (result.source_type === 'ngc' && result.extracted_data?.grade) {
        gradingData.ngc_number = result.extracted_data.grade;
      }
    }
    
    return gradingData;
  };

  const extractPopulationData = (webResults: any[]) => {
    return webResults
      .filter(result => result.extracted_data?.population_higher !== undefined)
      .map(result => ({
        grade: result.extracted_data.grade,
        population_higher: result.extracted_data.population_higher,
        population_same: result.extracted_data.population_same,
        total_graded: result.extracted_data.total_graded
      }));
  };

  const extractRecentSales = (webResults: any[]) => {
    return webResults
      .filter(result => result.price_data && result.auction_data)
      .map(result => ({
        price: result.price_data.current_price || result.price_data.realized_price,
        date: result.auction_data.sale_date || result.auction_data.end_time,
        source: result.source_type,
        grade: result.extracted_data?.grade
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const determineMarketTrend = (webResults: any[]) => {
    const trendResults = webResults.filter(result => 
      result.extracted_data?.market_trend || result.source_type === 'coinworld'
    );
    
    if (trendResults.length === 0) return 'stable';
    
    const trends = trendResults.map(result => result.extracted_data?.market_trend || 'stable');
    const risingCount = trends.filter(trend => trend === 'rising').length;
    const fallingCount = trends.filter(trend => trend === 'falling').length;
    
    if (risingCount > fallingCount) return 'rising';
    if (fallingCount > risingCount) return 'falling';
    return 'stable';
  };

  const confirmAnalysis = (claudeResult: any, webResults: any[]) => {
    let confirmationScore = 0;
    const totalChecks = 3;
    
    // Check name/type confirmation
    const nameMatches = webResults.some(result => 
      result.extracted_data?.title?.toLowerCase().includes(claudeResult.name.toLowerCase())
    );
    if (nameMatches) confirmationScore++;
    
    // Check year confirmation
    const yearMatches = webResults.some(result => 
      result.extracted_data?.title?.includes(claudeResult.year?.toString())
    );
    if (yearMatches) confirmationScore++;
    
    // Check grade/condition confirmation
    const gradeMatches = webResults.some(result => 
      result.extracted_data?.grade === claudeResult.grade
    );
    if (gradeMatches) confirmationScore++;
    
    return confirmationScore / totalChecks >= 0.5;
  };

  const extractDataSources = (webResults: any[]): string[] => {
    return [...new Set(webResults.map(result => result.source_type))];
  };

  const calculateEnrichmentScore = (claudeResult: any, webResults: any[]): number => {
    let score = 0.5; // Base score from Claude
    
    if (webResults.length > 0) score += 0.2;
    if (webResults.length > 5) score += 0.1;
    if (webResults.some(r => r.source_type === 'pcgs' || r.source_type === 'ngc')) score += 0.1;
    if (webResults.some(r => r.price_data && r.price_data.current_price)) score += 0.1;
    
    return Math.min(1.0, score);
  };

  const saveEnhancedResults = async (mergedData: any, imageFile: File) => {
    try {
      // Upload image to get URL
      const imageHash = await generateImageHash(imageFile);
      const fileName = `${imageHash}.${imageFile.type.split('/')[1]}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('coin-images')
        .upload(fileName, imageFile, { upsert: true });
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('coin-images')
        .getPublicUrl(fileName);
      
      const { data, error } = await supabase
        .from('dual_image_analysis')
        .insert({
          front_image_url: publicUrl,
          back_image_url: publicUrl, // Using same image for both sides for now
          front_image_hash: imageHash,
          back_image_hash: imageHash,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          analysis_results: mergedData,
          confidence_score: mergedData.confidence,
          estimated_value_range: {
            low: mergedData.market_value * 0.8,
            high: mergedData.market_value * 1.2,
            average: mergedData.market_value
          },
          grade_assessment: mergedData.grade,
          detected_errors: mergedData.errors || [],
          rarity_score: getRarityScore(mergedData.rarity)
        })
        .select()
        .single();
      
      if (error) {
        console.error('Failed to save enhanced results:', error);
        throw error;
      }
      
      return data?.id;
    } catch (error) {
      console.error('saveEnhancedResults error:', error);
      return null;
    }
  };

  const generateImageHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getRarityScore = (rarity: string): number => {
    const rarityMap: { [key: string]: number } = {
      'Common': 1,
      'Uncommon': 3,
      'Rare': 6,
      'Very Rare': 8,
      'Ultra Rare': 10,
      'Unknown': 5
    };
    return rarityMap[rarity] || 5;
  };

  return {
    performEnhancedAnalysis,
    isAnalyzing: isAnalyzing || isEnriching,
    isEnriching,
    enrichmentProgress,
    enhancedResult,
    claudeResult: result,
    error,
    clearResults: () => {
      clearResults();
      setEnhancedResult(null);
      setEnrichmentProgress(0);
    }
  };
};
