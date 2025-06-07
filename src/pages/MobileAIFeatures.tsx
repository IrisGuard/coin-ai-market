
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Brain, 
  Zap, 
  Camera, 
  WifiOff, 
  BarChart3,
  Upload,
  Star,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileStatsCard from '@/components/mobile/MobileStatsCard';
import EnhancedMobileCameraUploader from '@/components/mobile/EnhancedMobileCameraUploader';
import EnhancedMobileAI from '@/components/mobile/EnhancedMobileAI';

const MobileAIFeatures = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('overview');

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Recognition",
      description: "Multi-provider AI analysis with enhanced confidence scoring",
      stats: "95% accuracy",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: Camera,
      title: "Smart Camera Interface",
      description: "Guided coin photography with real-time quality feedback",
      stats: "5-step process",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: WifiOff,
      title: "Offline Capabilities",
      description: "Basic analysis and data sync when connection returns",
      stats: "Auto-sync",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Performance metrics and usage statistics",
      stats: "Live updates",
      color: "text-orange-600 bg-orange-50"
    }
  ];

  const handleImagesSelected = (images: { file: File; preview: string }[]) => {
    setSelectedImages(images);
    setCurrentTab('analysis');
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setCurrentTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mobile AI Features
              </h1>
              <p className="text-gray-600">
                Enhanced coin analysis powered by advanced AI
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              <Shield className="w-3 h-3 mr-1" />
              Offline Ready
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
              <Star className="w-3 h-3 mr-1" />
              Premium Features
            </Badge>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {feature.stats}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MobileStatsCard />
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-medium">1. Capture</h3>
                      <p className="text-sm text-gray-600">Take high-quality photos using guided camera</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-medium">2. Analyze</h3>
                      <p className="text-sm text-gray-600">AI analyzes coin with multiple providers</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-medium">3. List</h3>
                      <p className="text-sm text-gray-600">Create listing with AI-generated details</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setCurrentTab('camera')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/mobile-upload')}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="camera">
              <EnhancedMobileCameraUploader
                onImagesSelected={handleImagesSelected}
                maxImages={5}
                onComplete={() => setCurrentTab('analysis')}
              />
            </TabsContent>

            <TabsContent value="analysis">
              {selectedImages.length > 0 ? (
                <EnhancedMobileAI
                  imageBase64={selectedImages[0]?.preview || ''}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Please capture images first</p>
                    <Button 
                      onClick={() => setCurrentTab('camera')}
                      className="mt-4"
                    >
                      Go to Camera
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results">
              {analysisResults ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">
                          {analysisResults.identification?.name || 'Unknown Coin'}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Year:</span>
                            <p className="font-medium">{analysisResults.identification?.year || 'Unknown'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Grade:</span>
                            <p className="font-medium">{analysisResults.grading?.grade || 'Unknown'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Value:</span>
                            <p className="font-medium">${analysisResults.valuation?.current_value || 0}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <p className="font-medium">{Math.round(analysisResults.confidence * 100)}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => navigate('/mobile-upload')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Create Listing
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedImages([]);
                            setAnalysisResults(null);
                            setCurrentTab('camera');
                          }}
                          className="flex-1"
                        >
                          New Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No analysis results yet</p>
                    <Button 
                      onClick={() => setCurrentTab('analysis')}
                      className="mt-4"
                    >
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileAIFeatures;
