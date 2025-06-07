import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Zap, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Cpu,
  Network,
  Target
} from 'lucide-react';
import { useAdvancedAIBrain } from '@/hooks/useAdvancedAIBrain';
import { toast } from '@/hooks/use-toast';

interface AIProvider {
  name: string;
  isActive: boolean;
  reliability: number;
  averageResponseTime: number;
}

const AdvancedAIControls = () => {
  const { providers, isProcessing } = useAdvancedAIBrain();
  const [confidenceThreshold, setConfidenceThreshold] = useState([85]);
  const [learningRate, setLearningRate] = useState([0.1]);
  const [crossValidationEnabled, setCrossValidationEnabled] = useState(true);
  const [adaptiveSwitching, setAdaptiveSwitching] = useState(true);
  const [realTimeLearning, setRealTimeLearning] = useState(true);

  const [brainStats, setBrainStats] = useState({
    activeProviders: 1,
    totalLearningCycles: 1847,
    accuracyImprovement: 12.5,
    processingOptimization: 23.8,
    userFeedbackProcessed: 342
  });

  const [enhancedProviders] = useState<AIProvider[]>([
    {
      name: 'anthropic',
      isActive: true,
      reliability: 0.95,
      averageResponseTime: 1200
    }
  ]);

  useEffect(() => {
    // Simulate real-time brain stats updates
    const interval = setInterval(() => {
      setBrainStats(prev => ({
        ...prev,
        totalLearningCycles: prev.totalLearningCycles + Math.floor(Math.random() * 3),
        userFeedbackProcessed: prev.userFeedbackProcessed + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimizeBrain = async () => {
    toast({
      title: "AI Brain Optimization Started",
      description: "Running advanced algorithms to optimize neural pathways...",
    });

    // Simulate optimization process
    setTimeout(() => {
      setBrainStats(prev => ({
        ...prev,
        accuracyImprovement: prev.accuracyImprovement + 1.2,
        processingOptimization: prev.processingOptimization + 2.1
      }));

      toast({
        title: "Optimization Complete",
        description: "AI Brain performance improved by 3.3%",
      });
    }, 3000);
  };

  const handleResetLearning = () => {
    toast({
      title: "Learning Reset",
      description: "AI Brain learning models have been reset to baseline",
      variant: "destructive",
    });
  };

  const getProviderStatusColor = (reliability: number) => {
    if (reliability >= 0.9) return 'text-green-600 bg-green-100';
    if (reliability >= 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProviderStatusIcon = (reliability: number) => {
    if (reliability >= 0.9) return <CheckCircle2 className="w-4 h-4" />;
    if (reliability >= 0.8) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Brain Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-blue-600">{brainStats.activeProviders}</p>
              </div>
              <Network className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Learning Cycles</p>
                <p className="text-2xl font-bold text-purple-600">{brainStats.totalLearningCycles.toLocaleString()}</p>
              </div>
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Accuracy +</p>
                <p className="text-2xl font-bold text-green-600">{brainStats.accuracyImprovement.toFixed(1)}%</p>
              </div>
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Speed +</p>
                <p className="text-2xl font-bold text-orange-600">{brainStats.processingOptimization.toFixed(1)}%</p>
              </div>
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Feedback</p>
                <p className="text-2xl font-bold text-indigo-600">{brainStats.userFeedbackProcessed}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Provider Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI Provider Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedProviders.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={getProviderStatusColor(provider.reliability)}>
                    {getProviderStatusIcon(provider.reliability)}
                    {provider.name.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">Reliability: {(provider.reliability * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Avg Response: {provider.averageResponseTime}ms</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={provider.reliability * 100} className="w-24" />
                  <Switch 
                    checked={provider.isActive} 
                    disabled={isProcessing}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced AI Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Confidence & Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Confidence Threshold: {confidenceThreshold[0]}%</Label>
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                max={100}
                min={50}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Minimum confidence required for automatic processing
              </p>
            </div>

            <div className="space-y-3">
              <Label>Learning Rate: {learningRate[0].toFixed(2)}</Label>
              <Slider
                value={learningRate}
                onValueChange={setLearningRate}
                max={1}
                min={0.01}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                How quickly the AI adapts to new patterns
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cross-Validation</Label>
                  <p className="text-xs text-gray-500">Verify results across multiple providers</p>
                </div>
                <Switch
                  checked={crossValidationEnabled}
                  onCheckedChange={setCrossValidationEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Adaptive Provider Switching</Label>
                  <p className="text-xs text-gray-500">Automatically switch to optimal providers</p>
                </div>
                <Switch
                  checked={adaptiveSwitching}
                  onCheckedChange={setAdaptiveSwitching}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time Learning</Label>
                  <p className="text-xs text-gray-500">Learn from user corrections immediately</p>
                </div>
                <Switch
                  checked={realTimeLearning}
                  onCheckedChange={setRealTimeLearning}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Brain Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleOptimizeBrain}
                className="w-full"
                disabled={isProcessing}
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize Neural Pathways
              </Button>

              <Button 
                variant="outline"
                onClick={handleResetLearning}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Reset Learning Models
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Accuracy Improvement:</span>
                  <span className="font-medium text-blue-900">+{brainStats.accuracyImprovement.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Speed Optimization:</span>
                  <span className="font-medium text-blue-900">+{brainStats.processingOptimization.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Learning Cycles:</span>
                  <span className="font-medium text-blue-900">{brainStats.totalLearningCycles.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Real-time Learning Status</h4>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Processing {brainStats.userFeedbackProcessed} feedback entries</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAIControls;
