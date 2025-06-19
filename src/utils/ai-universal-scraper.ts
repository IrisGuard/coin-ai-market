
import { supabase } from '@/integrations/supabase/client';

export interface CoinData {
  name?: string;
  year?: number;
  price?: number;
  grade?: string;
  source_url: string;
  extracted_at: string;
  confidence_score: number;
  additional_data: {
    ai_analysis: any;
    structured_extraction: any;
  };
}

export class UniversalCoinScraper {
  private aiPrompt = `
    Analyze this coin website content and extract:
    1. Coin name/title
    2. Year/date  
    3. Price/value
    4. Grade/condition
    5. Rarity information
    6. Historical data
    7. Any mint marks
    8. Error varieties
    9. Auction results
    10. Market trends
    
    Return as structured JSON with confidence scores.
  `;

  async analyzeWebsite(url: string): Promise<CoinData> {
    try {
      console.log(`Starting analysis of: ${url}`);
      
      // Fetch page content using the existing url-reader function
      const response = await supabase.functions.invoke('url-reader', {
        body: { url }
      });
      
      if (response.error) {
        throw new Error(`Failed to fetch content: ${response.error.message}`);
      }

      const contentData = response.data;
      
      if (!contentData.success) {
        throw new Error(contentData.error || 'Failed to fetch content');
      }

      // Real AI-powered content extraction using existing AI function
      const aiAnalysis = await this.performRealAIExtraction(contentData.content, url);
      
      // Structured data extraction
      const structuredData = this.extractStructuredData(contentData.content);
      
      // Combine and validate
      return this.combineAndValidate(aiAnalysis, structuredData, url);
      
    } catch (error) {
      console.error('Scraping failed:', error);
      throw error;
    }
  }

  private async performRealAIExtraction(content: string, url: string): Promise<any> {
    try {
      // Use the existing AI coin recognition function
      const { data, error } = await supabase.functions.invoke('ai-coin-recognition', {
        body: {
          content: content,
          url: url,
          analysis_type: 'web_content_extraction'
        }
      });

      if (error) {
        console.error('AI extraction error:', error);
        // Return structured extraction as fallback
        return this.extractBasicDataFromContent(content);
      }

      return data?.analysis || this.extractBasicDataFromContent(content);
    } catch (error) {
      console.error('AI extraction failed:', error);
      return this.extractBasicDataFromContent(content);
    }
  }

  private extractBasicDataFromContent(content: string): any {
    return {
      name: this.extractCoinName(content),
      year: this.extractYear(content),
      price: this.extractPrice(content),
      grade: this.extractGrade(content),
      confidence: this.calculateBasicConfidence(content),
      rarity: this.extractRarity(content),
      mint_marks: this.extractMintMarks(content),
      errors: this.extractErrors(content)
    };
  }

  private extractStructuredData(content: string): any {
    const data: any = {};
    
    // Price patterns
    const priceRegex = /\$[\d,]+\.?\d*/g;
    const prices = content.match(priceRegex);
    if (prices) data.prices = prices.slice(0, 5); // Limit results
    
    // Year patterns  
    const yearRegex = /\b(18|19|20)\d{2}\b/g;
    const years = content.match(yearRegex);
    if (years) data.years = [...new Set(years)].slice(0, 5);
    
    // Grade patterns
    const gradeRegex = /\b(MS|AU|XF|VF|F|VG|G|AG|PR)\s*\d+\b/gi;
    const grades = content.match(gradeRegex);
    if (grades) data.grades = [...new Set(grades)].slice(0, 5);

    // Denomination patterns
    const denomRegex = /\b(cent|penny|nickel|dime|quarter|half dollar|dollar|eagle)\b/gi;
    const denominations = content.match(denomRegex);
    if (denominations) data.denominations = [...new Set(denominations)].slice(0, 5);

    // Country patterns
    const countryRegex = /\b(United States|USA|US|American|British|Canadian|German|French)\b/gi;
    const countries = content.match(countryRegex);
    if (countries) data.countries = [...new Set(countries)].slice(0, 3);
    
    return data;
  }

  private combineAndValidate(aiData: any, structuredData: any, url: string): CoinData {
    const combined: CoinData = {
      name: aiData.name || this.extractBestTitle(structuredData),
      year: aiData.year || this.extractBestYear(structuredData.years),
      price: aiData.price || this.extractBestPrice(structuredData.prices),
      grade: aiData.grade || structuredData.grades?.[0],
      source_url: url,
      extracted_at: new Date().toISOString(),
      confidence_score: this.calculateRealConfidence(aiData, structuredData),
      additional_data: {
        ai_analysis: aiData,
        structured_extraction: structuredData
      }
    };

    return combined;
  }

  private extractCoinName(content: string): string | undefined {
    // Look for common coin name patterns
    const namePatterns = [
      /(\d{4}.*?(?:cent|penny|nickel|dime|quarter|half dollar|dollar|eagle))/gi,
      /(Morgan Dollar|Peace Dollar|Walking Liberty|Mercury Dime|Buffalo Nickel)/gi,
      /(\w+\s+\w+\s+(?:cent|penny|nickel|dime|quarter|dollar))/gi
    ];

    for (const pattern of namePatterns) {
      const match = content.match(pattern);
      if (match && match[0]) {
        return match[0].trim();
      }
    }

    return undefined;
  }

  private extractYear(content: string): number | undefined {
    const yearRegex = /\b(18|19|20)\d{2}\b/g;
    const years = content.match(yearRegex);
    if (years) {
      // Return the most likely coin year (between 1792-2024)
      const coinYears = years
        .map(y => parseInt(y))
        .filter(y => y >= 1792 && y <= 2024);
      
      return coinYears[0];
    }
    return undefined;
  }

  private extractPrice(content: string): number | undefined {
    const priceRegex = /\$[\d,]+\.?\d*/g;
    const prices = content.match(priceRegex);
    if (prices) {
      // Parse and return the first reasonable price
      const numericPrice = parseFloat(prices[0].replace(/[$,]/g, ''));
      return numericPrice > 0 ? numericPrice : undefined;
    }
    return undefined;
  }

  private extractGrade(content: string): string | undefined {
    const gradeRegex = /\b(MS|AU|XF|VF|F|VG|G|AG|PR)\s*\d+\b/gi;
    const grades = content.match(gradeRegex);
    return grades?.[0];
  }

  private extractRarity(content: string): string | undefined {
    const rarityPatterns = [
      /\b(common|scarce|rare|very rare|extremely rare|unique)\b/gi,
      /\b(R-[1-8])\b/gi,
      /\b(low mintage|high mintage)\b/gi
    ];

    for (const pattern of rarityPatterns) {
      const match = content.match(pattern);
      if (match) return match[0];
    }

    return undefined;
  }

  private extractMintMarks(content: string): string[] {
    const mintMarkRegex = /\b([DPSO])\s*mint\s*mark\b/gi;
    const marks = content.match(mintMarkRegex);
    return marks ? [...new Set(marks)] : [];
  }

  private extractErrors(content: string): string[] {
    const errorPatterns = [
      /double\s*die/gi,
      /off\s*center/gi,
      /clipped\s*planchet/gi,
      /broadstrike/gi,
      /lamination/gi,
      /die\s*crack/gi
    ];

    const errors: string[] = [];
    errorPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) errors.push(...matches);
    });

    return [...new Set(errors)];
  }

  private extractBestTitle(structuredData: any): string | undefined {
    // Try to construct a title from available data
    const year = this.extractBestYear(structuredData.years);
    const denom = structuredData.denominations?.[0];
    
    if (year && denom) {
      return `${year} ${denom}`;
    }
    
    return undefined;
  }

  private extractBestYear(years: string[]): number | undefined {
    if (!years || years.length === 0) return undefined;
    
    const coinYears = years
      .map(y => parseInt(y))
      .filter(y => y >= 1792 && y <= 2024);
    
    return coinYears[0];
  }

  private extractBestPrice(prices: string[]): number | undefined {
    if (!prices || prices.length === 0) return undefined;
    
    const numericPrices = prices
      .map(p => parseFloat(p.replace(/[$,]/g, '')))
      .filter(p => p > 0 && p < 1000000); // Reasonable price range
    
    return numericPrices[0];
  }

  private calculateRealConfidence(aiData: any, structuredData: any): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on data quality
    if (aiData.name || structuredData.denominations?.length) confidence += 0.1;
    if (aiData.year || structuredData.years?.length) confidence += 0.1;
    if (aiData.price || structuredData.prices?.length) confidence += 0.1;
    if (aiData.grade || structuredData.grades?.length) confidence += 0.1;
    if (structuredData.countries?.length) confidence += 0.05;
    
    // Apply AI confidence if available
    if (aiData.confidence) {
      confidence = (confidence + aiData.confidence) / 2;
    }
    
    return Math.min(1.0, Math.max(0.1, confidence));
  }

  private calculateBasicConfidence(content: string): number {
    let score = 0.3; // Base score
    
    if (content.length > 1000) score += 0.1;
    if (content.includes('$')) score += 0.1;
    if (/\b(18|19|20)\d{2}\b/.test(content)) score += 0.1;
    if (/\b(MS|AU|XF|VF)\b/i.test(content)) score += 0.1;
    if (/\b(coin|numismatic|grade)\b/i.test(content)) score += 0.1;
    
    return Math.min(0.9, score);
  }
}

export const universalScraper = new UniversalCoinScraper();
