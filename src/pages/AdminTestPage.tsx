import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createRealTestCoin, verifyEndToEndFlow } from '@/utils/adminTestActions';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminTestPage = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const runCompleteTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    try {
      // Step 1: Create test coin
      setCurrentStep('Creating test coin...');
      const coinData = await createRealTestCoin();
      
      // Step 2: Verify end-to-end flow
      setCurrentStep('Verifying end-to-end flow...');
      const verification = await verifyEndToEndFlow(coinData.coin.id);
      
      setTestResults({
        coinData,
        verification,
        success: true,
        coinId: coinData.coin.id
      });
      
      setCurrentStep('Test completed successfully!');
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        error: error.message,
        success: false
      });
      setCurrentStep('Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              🧪 Live Site End-to-End Test
            </CardTitle>
            <p className="text-gray-600">
              Test the complete flow of coin creation and verification across all components
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runCompleteTest} 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Running Test...' : 'Run Complete End-to-End Test'}
              </Button>
              
              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-gray-600">{currentStep}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {testResults.success ? (
                <>
                  {/* Coin Creation Results */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Coin Creation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Coin Created</div>
                        <div className="font-semibold">{testResults.coinData.coin.name}</div>
                        <div className="text-xs text-gray-500">ID: {testResults.coinData.coin.id}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Store</div>
                        <div className="font-semibold">{testResults.coinData.store.name}</div>
                        <div className="text-xs text-gray-500">ID: {testResults.coinData.store.id}</div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Results */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">End-to-End Verification</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.coinExists} />
                        <span>Coin Exists in Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.storeExists} />
                        <span>Store Exists in Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.appearsInStoreQuery} />
                        <span>Appears in Store Query</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.appearsInUserQuery} />
                        <span>Appears in User Query</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.appearsInFeaturedQuery} />
                        <span>Appears in Featured Query</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={testResults.verification.appearsInCategoryQuery} />
                        <span>Appears in Category Query</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Database Statistics</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {testResults.verification.totalStoreCoins}
                        </div>
                        <div className="text-xs text-gray-600">Store Coins</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {testResults.verification.totalUserCoins}
                        </div>
                        <div className="text-xs text-gray-600">User Coins</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {testResults.verification.totalFeaturedCoins}
                        </div>
                        <div className="text-xs text-gray-600">Featured Coins</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {testResults.verification.totalCategoryCoins}
                        </div>
                        <div className="text-xs text-gray-600">Category Coins</div>
                      </div>
                    </div>
                  </div>

                  {/* Test Links */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Test Navigation</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`/store/${testResults.coinData.store.id}`, '_blank')}
                      >
                        View Store Page
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`/coin/${testResults.coinId}`, '_blank')}
                      >
                        View Coin Page
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open('/marketplace', '_blank')}
                      >
                        View Marketplace
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open('/categories/greek', '_blank')}
                      >
                        View Greek Category
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Test Completed Successfully!
                      </span>
                    </div>
                    <p className="text-green-700 mt-1">
                      The coin has been created and should now appear in all relevant sections of the site.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Test Failed</span>
                  </div>
                  <p className="text-red-700 mt-1">{testResults.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTestPage; 