import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon, 
  Search,
  Download,
  Trash2,
  Settings
} from 'lucide-react';
import { 
  generateImageReport, 
  getImageReportSummary, 
  getProblematicCoins,
  fixBrokenCoinImages,
  type CoinImageReport 
} from '@/utils/imageUtils';
import { toast } from 'sonner';

const ImageDebugTool: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reports, setReports] = useState<CoinImageReport[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [problematicCoins, setProblematicCoins] = useState<CoinImageReport[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinImageReport | null>(null);
  const [isFixing, setIsFixing] = useState<string | null>(null);

  const runImageScan = async () => {
    setIsScanning(true);
    setProgress(0);
    
    try {
      toast.info('🔍 Starting comprehensive image scan...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 200);
      
      const imageReports = await generateImageReport();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setReports(imageReports);
      setSummary(getImageReportSummary(imageReports));
      setProblematicCoins(getProblematicCoins(imageReports));
      
      toast.success('✅ Image scan completed!');
    } catch (error) {
      console.error('❌ Scan failed:', error);
      toast.error('❌ Image scan failed');
    } finally {
      setIsScanning(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const fixCoin = async (coinId: string) => {
    setIsFixing(coinId);
    try {
      const success = await fixBrokenCoinImages(coinId);
      if (success) {
        toast.success('✅ Coin images fixed!');
        // Refresh the specific coin data
        await runImageScan();
      } else {
        toast.error('❌ Failed to fix coin images');
      }
    } catch (error) {
      console.error('❌ Fix failed:', error);
      toast.error('❌ Error fixing coin images');
    } finally {
      setIsFixing(null);
    }
  };

  const exportReport = () => {
    if (!reports.length) return;
    
    const csvContent = [
      'Coin ID,Coin Name,User,Store,Total Images,Valid Images,Broken Images,Status',
      ...reports.map(report => [
        report.coinId,
        `"${report.coinName}"`,
        `"${report.userName || 'Unknown'}"`,
        `"${report.storeName || 'No Store'}"`,
        report.totalImages,
        report.validImages,
        report.brokenImages,
        report.hasValidImages ? 'OK' : 'NEEDS ATTENTION'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coin-image-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Debug & Validation Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runImageScan}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Run Full Image Scan'}
            </Button>
            
            {reports.length > 0 && (
              <Button 
                variant="outline"
                onClick={exportReport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            )}
          </div>
          
          {isScanning && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Validating images... {progress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{summary.coinsWithValidImages}</p>
                  <p className="text-sm text-gray-600">Coins with Valid Images</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{summary.coinsWithBrokenImages}</p>
                  <p className="text-sm text-gray-600">Coins with Broken Images</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{summary.coinsWithoutAnyImages}</p>
                  <p className="text-sm text-gray-600">Coins without Images</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{summary.validImagePercentage}%</p>
                  <p className="text-sm text-gray-600">Valid Image Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Problematic Coins */}
      {problematicCoins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Coins Needing Attention ({problematicCoins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {problematicCoins.map((coin) => (
                <div 
                  key={coin.coinId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{coin.coinName}</h4>
                      <Badge variant={coin.hasValidImages ? 'default' : 'destructive'}>
                        {coin.hasValidImages ? 'Has Some Valid' : 'No Valid Images'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>User: {coin.userName || 'Unknown'}</span>
                      {coin.storeName && <span> • Store: {coin.storeName}</span>}
                      <span> • Images: {coin.validImages}/{coin.totalImages} valid</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCoin(coin)}
                    >
                      <Search className="w-4 h-4" />
                      Inspect
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fixCoin(coin.coinId)}
                      disabled={isFixing === coin.coinId}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {isFixing === coin.coinId ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Settings className="w-4 h-4" />
                      )}
                      Fix
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Coin Inspector */}
      {selectedCoin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inspecting: {selectedCoin.coinName}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCoin(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Coin ID:</strong> {selectedCoin.coinId}
                </div>
                <div>
                  <strong>User:</strong> {selectedCoin.userName || 'Unknown'}
                </div>
                <div>
                  <strong>Store:</strong> {selectedCoin.storeName || 'No Store'}
                </div>
                <div>
                  <strong>Total Images:</strong> {selectedCoin.totalImages}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Image Analysis:</h4>
                <div className="space-y-2">
                  {selectedCoin.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded border ${
                        image.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {image.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs truncate">
                          {image.url}
                        </div>
                        {image.error && (
                          <div className="text-red-600 text-xs mt-1">
                            Error: {image.error}
                          </div>
                        )}
                        {image.naturalWidth && image.naturalHeight && (
                          <div className="text-gray-600 text-xs mt-1">
                            {image.naturalWidth} × {image.naturalHeight}px
                          </div>
                        )}
                      </div>
                      
                      <Badge variant={image.isValid ? 'default' : 'destructive'}>
                        {image.isValid ? 'Valid' : 'Broken'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Run Full Image Scan:</strong> Validates all images in the database</p>
            <p>• <strong>Inspect:</strong> View detailed information about specific coin images</p>
            <p>• <strong>Fix:</strong> Automatically replace broken images with placeholders</p>
            <p>• <strong>Export Report:</strong> Download CSV report for further analysis</p>
            <p>• <strong>Valid images:</strong> Successfully loaded images</p>
            <p>• <strong>Broken images:</strong> Failed to load, blob URLs, or invalid URLs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageDebugTool; 