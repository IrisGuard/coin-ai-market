
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Upload, Zap, Activity, Camera, FileImage, Loader2 } from 'lucide-react';
import { useEnhancedCoinRecognition } from '@/hooks/useEnhancedCoinRecognition';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const ProductionDealerPanel: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [autoFillData, setAutoFillData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const {
    performEnhancedAnalysis,
    performBulkAnalysis,
    isAnalyzing,
    enhancedResult,
    claudeResult,
    autoFillData: hookAutoFillData,
    clearResults
  } = useEnhancedCoinRecognition();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('📁 FILES UPLOADED TO LIVE DEALER SYSTEM:', acceptedFiles.length);
    setUploadedFiles(acceptedFiles);
    
    if (acceptedFiles.length === 1) {
      toast.success(`Single image uploaded: ${acceptedFiles[0].name}`);
    } else {
      toast.success(`${acceptedFiles.length} images uploaded for bulk analysis`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp']
    },
    multiple: true,
    maxFiles: 10
  });

  const executeAIAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }

    try {
      console.log('🧠 EXECUTING LIVE AI ANALYSIS WITH PRODUCTION BRAIN');
      
      let results;
      if (uploadedFiles.length === 1) {
        // Single image analysis
        results = await performEnhancedAnalysis(uploadedFiles[0]);
        console.log('✅ Single image analysis completed:', results);
      } else {
        // Bulk analysis for multiple images
        results = await performBulkAnalysis(uploadedFiles);
        console.log('✅ Bulk analysis completed:', results);
      }

      setAnalysisResults(results);
      
      if (hookAutoFillData) {
        setAutoFillData(hookAutoFillData);
        console.log('📝 AUTO-FILL DATA GENERATED:', hookAutoFillData);
      }

    } catch (error) {
      console.error('AI Analysis error:', error);
      toast.error('AI analysis failed - please try again');
    }
  };

  const clearAllData = () => {
    setUploadedFiles([]);
    setAutoFillData(null);
    setAnalysisResults(null);
    clearResults();
    toast.success('All data cleared');
  };

  const exportAnalysisData = () => {
    if (!analysisResults) {
      toast.error('No analysis data to export');
      return;
    }

    const exportData = {
      analysis_results: analysisResults,
      auto_fill_data: autoFillData,
      uploaded_files: uploadedFiles.map(f => f.name),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coin-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analysis data exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
            🔴 LIVE PRODUCTION DEALER PANEL - AI BRAIN ACTIVE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">AI Brain Status</div>
                <Badge className="bg-green-600">LIVE & PROCESSING</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">Auto-Fill Engine</div>
                <Badge className="bg-orange-600">READY</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-800">Image Recognition</div>
                <Badge className="bg-blue-600">ACTIVE</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Coin Image Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop coin images here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, WebP • Multiple images for bulk analysis
                </p>
              </div>
            )}
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileImage className="h-4 w-4" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button 
              onClick={executeAIAnalysis} 
              disabled={uploadedFiles.length === 0 || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
            <Button onClick={clearAllData} variant="outline">
              Clear All
            </Button>
            {analysisResults && (
              <Button onClick={exportAnalysisData} variant="outline">
                Export Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enhancedResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Enhanced Analysis Complete</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Confidence Score:</span>
                      <span className="ml-2">{Math.round((enhancedResult.enrichment_score || 0) * 100)}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Data Sources:</span>
                      <span className="ml-2">{enhancedResult.data_sources?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {claudeResult && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Claude AI Recognition</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Coin:</span> {claudeResult.name || 'Unknown'}</div>
                    <div><span className="font-medium">Year:</span> {claudeResult.year || 'Unknown'}</div>
                    <div><span className="font-medium">Grade:</span> {claudeResult.grade || 'Ungraded'}</div>
                    <div><span className="font-medium">Estimated Value:</span> ${claudeResult.estimatedValue || 0}</div>
                    {claudeResult.errors && (
                      <div><span className="font-medium">Detected Errors:</span> {claudeResult.errors.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-Fill Data */}
      {autoFillData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Auto-Fill Form Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(autoFillData).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium text-sm text-gray-700">{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="text-sm mt-1">{String(value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionDealerPanel;
