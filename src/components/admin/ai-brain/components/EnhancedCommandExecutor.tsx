
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Play, Settings, Zap, TrendingUp, Search, Bot } from 'lucide-react';

interface EnhancedCommandExecutorProps {
  command: any;
  onExecute: (commandId: string, inputData: any) => Promise<any>;
  isExecuting: boolean;
}

const EnhancedCommandExecutor: React.FC<EnhancedCommandExecutorProps> = ({
  command,
  onExecute,
  isExecuting
}) => {
  const [inputData, setInputData] = useState('{}');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web_scraping': return <Search className="h-4 w-4" />;
      case 'expert_analysis': return <Zap className="h-4 w-4" />;
      case 'market_intelligence': return <TrendingUp className="h-4 w-4" />;
      case 'automation': return <Bot className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web_scraping': return 'bg-orange-100 text-orange-800';
      case 'expert_analysis': return 'bg-teal-100 text-teal-800';
      case 'market_intelligence': return 'bg-blue-100 text-blue-800';
      case 'automation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecute = async () => {
    try {
      let parsedInput = {};
      try {
        parsedInput = JSON.parse(inputData);
      } catch {
        parsedInput = { input: inputData };
      }

      const result = await onExecute(command.id, parsedInput);
      setExecutionResult(result);
    } catch (error) {
      console.error('Command execution failed:', error);
      setExecutionResult({ error: error.message });
    }
  };

  const getDefaultInput = (commandType: string) => {
    switch (commandType) {
      case 'coin_ebay_scraper':
        return JSON.stringify({
          searchTerm: "1921 Morgan Silver Dollar",
          condition: "MS-65",
          maxResults: 50
        }, null, 2);
      case 'coin_condition_expert':
        return JSON.stringify({
          imageUrl: "https://example.com/coin-image.jpg",
          coinType: "Morgan Dollar",
          year: 1921
        }, null, 2);
      case 'coin_price_predictor':
        return JSON.stringify({
          coinType: "Morgan Dollar",
          year: 1921,
          grade: "MS-65",
          timeframe: "30d"
        }, null, 2);
      default:
        return JSON.stringify({
          coinType: "Morgan Dollar",
          year: 1921,
          grade: "MS-65"
        }, null, 2);
    }
  };

  React.useEffect(() => {
    if (command) {
      setInputData(getDefaultInput(command.command_type));
    }
  }, [command]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(command.category)}
            <div>
              <h3 className="text-lg font-semibold">
                {command.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {command.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(command.category)}>
              {command.category.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline">
              Priority {command.priority}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Input Configuration</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-3 w-3 mr-1" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
          </div>

          {showAdvanced ? (
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter JSON input data..."
              className="font-mono text-sm"
              rows={8}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Coin Type</label>
                <Input placeholder="Morgan Dollar" />
              </div>
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input placeholder="1921" />
              </div>
              <div>
                <label className="text-sm font-medium">Grade</label>
                <Input placeholder="MS-65" />
              </div>
              <div>
                <label className="text-sm font-medium">Timeframe</label>
                <Input placeholder="30d" />
              </div>
            </div>
          )}
        </div>

        {/* Execution Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex-1"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? 'Executing...' : 'Execute Command'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Timeout: {command.execution_timeout / 1000}s
          </div>
        </div>

        {/* Execution Results */}
        {executionResult && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Execution Results</h4>
            <Card>
              <CardContent className="pt-4">
                <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(executionResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Command Details */}
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div>
            <div className="font-medium">Command Type</div>
            <div className="text-muted-foreground">{command.command_type}</div>
          </div>
          <div>
            <div className="font-medium">Category</div>
            <div className="text-muted-foreground">{command.category}</div>
          </div>
          <div>
            <div className="font-medium">Created</div>
            <div className="text-muted-foreground">
              {new Date(command.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCommandExecutor;
