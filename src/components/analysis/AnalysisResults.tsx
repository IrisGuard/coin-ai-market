
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
  const { analysisResults, frontImage, backImage } = results;

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Analysis Complete
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

      {/* Image Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Analyzed Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-center">Front Side (Obverse)</h3>
              <img 
                src={`data:image/jpeg;base64,${frontImage}`}
                alt="Front side" 
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-center">Back Side (Reverse)</h3>
              <img 
                src={`data:image/jpeg;base64,${backImage}`}
                alt="Back side" 
                className="w-full max-w-sm mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            Coin Identification
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
              Estimated Value
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
                <p className="text-sm text-gray-600">Average Estimate</p>
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

      {/* Errors and Issues */}
      {analysisResults.errors && analysisResults.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Detected Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysisResults.errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span>{error}</span>
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
              <p>Dual-side Claude AI Recognition</p>
            </div>
            <div className="space-y-2">
              <span className="font-medium">AI Provider</span>
              <p>Anthropic Claude (Sonnet)</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This analysis was performed using advanced AI recognition 
              on both sides of your coin. Results are based on visual analysis and may vary 
              from professional grading services. For investment decisions, consider getting 
              a professional appraisal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
