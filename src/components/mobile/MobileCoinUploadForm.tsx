import React, { useState } from 'react';
import { useCreateCoin, useAICoinRecognition } from '@/hooks/useCoins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, DollarSign, CheckCircle, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import EnhancedMobileCameraUploader from './EnhancedMobileCameraUploader';

interface ImageWithQuality {
  file: File;
  preview: string;
  quality: 'excellent' | 'good' | 'poor';
  blurScore: number;
}

const MobileCoinUploadForm = () => {
  const createCoin = useCreateCoin();
  const aiRecognition = useAICoinRecognition();
  const [images, setImages] = useState<ImageWithQuality[]>([]);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPriceEditor, setShowPriceEditor] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  const [step, setStep] = useState<'capture' | 'analyze' | 'review' | 'complete'>('capture');

  const handleImagesSelected = async (selectedImages: ImageWithQuality[]) => {
    setImages(selectedImages);
    setStep('analyze');
    
    // Start real AI analysis
    setIsAnalyzing(true);
    try {
      const primaryImage = selectedImages[0];
      const additionalImages = selectedImages.slice(1);
      
      const result = await aiRecognition.mutateAsync({
        image: await convertFileToBase64(primaryImage.file),
        additionalImages: await Promise.all(
          additionalImages.map(img => convertFileToBase64(img.file))
        )
      });
      
      setAiResult(result);
      setCustomPrice(result.estimated_value?.toString() || '');
      setStep('review');
      
    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to analyze the coin. Please check your image quality and try again.",
        variant: "destructive",
      });
      // Still allow manual entry
      setStep('review');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleQuickList = async () => {
    if (images.length === 0) return;
    
    try {
      const price = customPrice ? parseFloat(customPrice) : (aiResult?.estimated_value || 10);
      
      await createCoin.mutateAsync({
        name: aiResult?.name || 'Unidentified Coin',
        year: aiResult?.year || new Date().getFullYear(),
        country: aiResult?.country || 'Unknown',
        grade: aiResult?.grade || 'Ungraded',
        price: price,
        rarity: aiResult?.rarity || 'Common',
        condition: aiResult?.condition || 'Good',
        composition: aiResult?.composition || 'Unknown',
        diameter: aiResult?.diameter,
        weight: aiResult?.weight,
        mint: aiResult?.mint || 'Unknown',
        description: aiResult?.description || 'Coin uploaded via mobile app',
        image: await convertFileToBase64(images[0].file),
      });

      setStep('complete');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setImages([]);
        setAiResult(null);
        setStep('capture');
        setShowPriceEditor(false);
        setCustomPrice('');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating coin:', error);
    }
  };

  if (step === 'capture') {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              📱 Mobile Coin Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedMobileCameraUploader
              onImagesSelected={handleImagesSelected}
              maxImages={6}
              coinType="normal"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'analyze') {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Analyzing Your Coin</h3>
            <p className="text-gray-600">
              Processing {images.length} high-quality photos...
            </p>
            <div className="mt-6 space-y-2">
              <div className="text-sm text-gray-500">✓ Image quality verified</div>
              <div className="text-sm text-gray-500">🔍 Identifying coin type</div>
              <div className="text-sm text-gray-500">💰 Calculating market value</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* AI Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiResult ? (
              <>
                <div>
                  <h3 className="text-lg font-bold">{aiResult.name}</h3>
                  <p className="text-gray-600">{aiResult.year} • {aiResult.country}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Grade:</span>
                    <p className="font-medium">{aiResult.grade}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <p className="font-medium">{aiResult.condition}</p>
                  </div>
                  {aiResult.mint && (
                    <div>
                      <span className="text-gray-500">Mint:</span>
                      <p className="font-medium">{aiResult.mint}</p>
                    </div>
                  )}
                  {aiResult.composition && (
                    <div>
                      <span className="text-gray-500">Composition:</span>
                      <p className="font-medium">{aiResult.composition}</p>
                    </div>
                  )}
                </div>

                {/* Error Detection */}
                {aiResult.errors && aiResult.errors.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">🔍 Mint Errors Detected:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      {aiResult.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Authentication Notes */}
                {aiResult.authentication_notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-1">⚠️ Authentication Notes:</h4>
                    <p className="text-sm text-yellow-700">{aiResult.authentication_notes}</p>
                  </div>
                )}

                {/* Price Section */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium">Market Value</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPriceEditor(!showPriceEditor)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showPriceEditor ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">$</span>
                      <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="flex-1 text-xl font-bold border border-gray-300 rounded px-2 py-1"
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-green-600">
                      ${customPrice || aiResult.estimated_value}
                    </div>
                  )}
                  
                  {aiResult.market_trend && (
                    <div className="text-xs text-green-600 mt-1">
                      Market trend: {aiResult.market_trend}
                    </div>
                  )}
                </div>

                <Badge className="w-full justify-center bg-blue-100 text-blue-800">
                  {Math.round((aiResult.confidence || 0.7) * 100)}% AI Confidence
                </Badge>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">AI analysis unavailable</p>
                <p className="text-sm text-gray-500">Manual entry required</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Captured Photos ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <Badge 
                    className={`absolute top-1 right-1 text-xs ${
                      image.quality === 'excellent' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {image.quality}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleQuickList}
            disabled={createCoin.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4"
          >
            {createCoin.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                Quick List for ${customPrice || aiResult?.estimated_value || '0'}
              </>
            )}
          </Button>
          
          <Button
            onClick={() => setStep('capture')}
            variant="outline"
            className="w-full"
          >
            Take New Photos
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Successfully Listed!</h3>
            <p className="text-gray-600 mb-4">
              Your coin has been added to the marketplace
            </p>
            <div className="text-lg font-bold text-green-600">
              Listed for ${customPrice}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Returning to camera in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MobileCoinUploadForm;
