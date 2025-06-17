
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award, 
  TrendingUp,
  RotateCw,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { DualAnalysisResult } from '@/hooks/useDualImageAnalysis';

interface AnalysisResultsProps {
  results: DualAnalysisResult;
  onNewAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onNewAnalysis }) => {
  const { anthropic_analysis, claude_analysis, comparison } = results;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  // Use comparison data as the primary analysis results
  const analysisResults = {
    coinName: comparison.consensus_name,
    year: comparison.consensus_year,
    country: comparison.consensus_country,
    denomination: anthropic_analysis?.denomination || claude_analysis?.denomination || 'Unknown',
    grade: anthropic_analysis?.grade || claude_analysis?.grade || 'Ungraded',
    rarity: anthropic_analysis?.rarity || claude_analysis?.rarity || 'Common',
    composition: anthropic_analysis?.composition || claude_analysis?.composition || 'Unknown',
    mint: anthropic_analysis?.mint || claude_analysis?.mint,
    diameter: anthropic_analysis?.diameter || claude_analysis?.diameter,
    weight: anthropic_analysis?.weight || claude_analysis?.weight,
    estimatedValue: {
      min: Math.min(anthropic_analysis?.estimated_value || 0, claude_analysis?.estimated_value || 0),
      average: comparison.consensus_value,
      max: Math.max(anthropic_analysis?.estimated_value || 0, claude_analysis?.estimated_value || 0)
    },
    confidence: comparison.confidence_score,
    errors: comparison.discrepancies
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Claude AI Analysis Complete
        </h1>
        <div className="flex items-center justify-center gap-3">
          <Badge 
            className={`${getConfidenceColor(analysisResults.confidence)} text-white px-4 py-2`}
          >
            {getConfidenceText(analysisResults.confidence)} - {Math.round(analysisResults.confidence * 100)}%
          </Badge>
          <Button onClick={onNewAnalysis} variant="outline">
            <RotateCw className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Dual Claude AI Analysis Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Dual Claude AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-center">Front Image Analysis</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {anthropic_analysis?.name || 'Unknown'}</p>
                <p><strong>Confidence:</strong> {anthropic_analysis?.confidence ? Math.round(anthropic_analysis.confidence * 100) : 0}%</p>
                <p><strong>Value:</strong> ${anthropic_analysis?.estimated_value || 0}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-center">Back Image Analysis</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {claude_analysis?.name || 'Unknown'}</p>
                <p><strong>Confidence:</strong> {claude_analysis?.confidence ? Math.round(claude_analysis.confidence * 100) : 0}%</p>
                <p><strong>Value:</strong> ${claude_analysis?.estimated_value || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            Consensus Coin Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Name</span>
              </div>
              <p className="text-lg">{analysisResults.coinName}</p>
            </div>

            {analysisResults.year && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Year</span>
                </div>
                <p className="text-lg">{analysisResults.year}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Country</span>
              </div>
              <p className="text-lg">{analysisResults.country}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Denomination</span>
              </div>
              <p className="text-lg">{analysisResults.denomination}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Grade</span>
              </div>
              <p className="text-lg">{analysisResults.grade}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Rarity</span>
              </div>
              <p className="text-lg">{analysisResults.rarity}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="font-medium">Composition</span>
              <p>{analysisResults.composition}</p>
            </div>

            {analysisResults.mint && (
              <div className="space-y-2">
                <span className="font-medium">Mint</span>
                <p>{analysisResults.mint}</p>
              </div>
            )}

            {analysisResults.diameter && (
              <div className="space-y-2">
                <span className="font-medium">Diameter</span>
                <p>{analysisResults.diameter} mm</p>
              </div>
            )}

            {analysisResults.weight && (
              <div className="space-y-2">
                <span className="font-medium">Weight</span>
                <p>{analysisResults.weight} g</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Valuation */}
      {analysisResults.estimatedValue.average > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Consensus Estimated Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Low Estimate</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${analysisResults.estimatedValue.min.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Consensus Value</p>
                <p className="text-3xl font-bold text-green-600">
                  ${analysisResults.estimatedValue.average.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">High Estimate</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${analysisResults.estimatedValue.max.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discrepancies */}
      {analysisResults.errors && analysisResults.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Analysis Discrepancies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysisResults.errors.map((discrepancy, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span>{discrepancy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-medium">Analysis Method</span>
              <p>Dual Claude AI Analysis (Front + Back)</p>
            </div>
            <div className="space-y-2">
              <span className="font-medium">Processing Time</span>
              <p>{(results.processing_time / 1000).toFixed(1)} seconds</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This analysis combines results from Claude AI analyzing both sides
              of the coin to provide a comprehensive identification. Any discrepancies between 
              front and back analysis are highlighted above. For investment decisions, 
              consider getting a professional appraisal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
