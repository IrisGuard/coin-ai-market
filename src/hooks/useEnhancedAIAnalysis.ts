
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface AIAnalysisInput {
  type: 'image' | 'site_url';
  imageUrl?: string;
  siteUrl?: string;
  additionalData?: any;
}

interface CoinAnalysisResult {
  coin_type: string;
  year: number;
  mint_mark?: string;
  metal: string;
  weight?: string;
  grade: string;
  error?: string;
  estimated_value: string;
  confidence: number;
  source: 'image_analysis' | 'site_parsing';
  market_data?: {
    trend: string;
    recent_sales: string[];
    authenticity_markers: string[];
  };
}

export const useEnhancedAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<CoinAnalysisResult[]>([]);
  
  const { data: availableCommands = [] } = useQuery({
    queryKey: ['available-ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const analyzeWithAI = async (input: AIAnalysisInput): Promise<CoinAnalysisResult> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      let analysisResult: CoinAnalysisResult;

      if (input.type === 'image' && input.imageUrl) {
        analysisResult = await performImageAnalysis(input.imageUrl);
      } else if (input.type === 'site_url' && input.siteUrl) {
        analysisResult = await performSiteAnalysis(input.siteUrl);
      } else {
        throw new Error('Invalid analysis input');
      }

      setResults(prev => [analysisResult, ...prev.slice(0, 4)]);
      toast.success(`AI Analysis completed with ${Math.round(analysisResult.confidence * 100)}% confidence`);
      
      return analysisResult;

    } catch (error: any) {
      toast.error(`AI Analysis failed: ${error.message}`);
      throw error;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const performImageAnalysis = async (imageUrl: string): Promise<CoinAnalysisResult> => {
    setAnalysisProgress(25);
    
    const imageCommand = availableCommands.find(
      cmd => cmd.category === 'coin_identification' && !cmd.site_url
    );

    if (!imageCommand) {
      throw new Error('No image analysis AI command available');
    }

    setAnalysisProgress(50);

    const { data, error } = await supabase.functions.invoke('anthropic-coin-recognition', {
      body: {
        image: imageUrl,
        analysis_type: 'comprehensive',
        include_valuation: true,
        include_errors: true,
        command_id: imageCommand.id
      }
    });

    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || 'Analysis failed');

    setAnalysisProgress(100);

    const analysis = data.analysis;
    return {
      coin_type: analysis.name || 'Unknown Coin',
      year: analysis.year || new Date().getFullYear(),
      mint_mark: analysis.mint,
      metal: analysis.composition || 'Unknown',
      weight: analysis.weight ? `${analysis.weight}g` : undefined,
      grade: analysis.grade || 'Ungraded',
      error: analysis.errors?.join(', '),
      estimated_value: `$${analysis.estimated_value || 0}`,
      confidence: analysis.confidence || 0.5,
      source: 'image_analysis'
    };
  };

  const performSiteAnalysis = async (siteUrl: string): Promise<CoinAnalysisResult> => {
    setAnalysisProgress(25);

    const siteCommand = availableCommands.find(
      cmd => cmd.category === 'market_analysis' && cmd.site_url
    );

    if (!siteCommand) {
      throw new Error('No site analysis AI command available');
    }

    setAnalysisProgress(50);

    const { data, error } = await supabase.functions.invoke('parse-website', {
      body: {
        url: siteUrl,
        instructions: siteCommand.code,
        commandId: siteCommand.id
      }
    });

    if (error) throw error;
    if (!data?.success) throw new Error('Site parsing failed');

    setAnalysisProgress(100);

    const extractedData = data.extractedData;
    return {
      coin_type: extractedData.title || 'Unknown Coin',
      year: parseInt(extractedData.possibleYears?.[0]) || new Date().getFullYear(),
      metal: extractedData.metals?.[0] || 'Unknown',
      grade: extractedData.grades?.[0] || 'Ungraded',
      estimated_value: extractedData.estimatedPrice || '$0',
      confidence: extractedData.parsingMetadata?.confidence || 0.7,
      source: 'site_parsing',
      market_data: {
        trend: 'stable',
        recent_sales: extractedData.prices || [],
        authenticity_markers: extractedData.itemSpecifics || []
      }
    };
  };

  const batchAnalyze = async (inputs: AIAnalysisInput[]): Promise<CoinAnalysisResult[]> => {
    const results: CoinAnalysisResult[] = [];
    
    for (let i = 0; i < inputs.length; i++) {
      try {
        const result = await analyzeWithAI(inputs[i]);
        results.push(result);
        toast.success(`Analysis ${i + 1}/${inputs.length} completed`);
      } catch (error) {
        toast.error(`Failed to analyze input ${i + 1}`);
      }
    }

    return results;
  };

  return {
    analyzeWithAI,
    batchAnalyze,
    isAnalyzing,
    analysisProgress,
    results,
    availableCommands
  };
};
