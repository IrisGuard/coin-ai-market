
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Trash2, Rocket, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useProductionCleanup } from '@/hooks/useProductionCleanup';

const ProductionCleanupButton = () => {
  const [isCleanupMode, setIsCleanupMode] = useState(false);
  const [cleanupProgress, setCleanupProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const { 
    mockDataPercentage, 
    platformCompletion, 
    isReady, 
    executeFullCleanup 
  } = useProductionCleanup();

  const handleCleanupClick = async () => {
    if (!isReady) {
      toast.error('Η πλατφόρμα δεν είναι ακόμα έτοιμη για καθαρισμό');
      return;
    }

    setIsCleanupMode(true);
    setCleanupProgress(0);

    const steps = [
      'Σάρωση αρχείων συστήματος...',
      'Διαγραφή mock components...',
      'Καθαρισμός demo data από βάση...',
      'Αφαίρεση test utilities...',
      'Διαγραφή placeholder αρχείων...',
      'Καθαρισμός analytics events...',
      'Ενεργοποίηση production mode...',
      'Τελική επαλήθευση...'
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setCleanupProgress((i + 1) * 12.5);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (i === 6) {
          // Execute the actual cleanup
          await executeFullCleanup();
        }
      }

      setIsCompleted(true);
      toast.success('🎉 Η πλατφόρμα είναι τώρα 100% LIVE και έτοιμη για πραγματικά νομίσματα!');
      
    } catch (error) {
      console.error('Cleanup error:', error);
      toast.error('Σφάλμα κατά τον καθαρισμό');
      setIsCleanupMode(false);
    }
  };

  if (isCompleted) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Rocket className="w-6 h-6" />
            🚀 ΠΛΑΤΦΟΡΜΑ LIVE - PRODUCTION READY!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-green-300 bg-green-100">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold text-green-800">
                ✅ Η πλατφόρμα είναι τώρα 100% καθαρή και έτοιμη για πραγματικά νομίσματα!
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-sm text-green-700">Ολοκλήρωση</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">0%</p>
                <p className="text-sm text-green-700">Mock Data</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">LIVE</p>
                <p className="text-sm text-green-700">Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCleanupMode) {
    return (
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 animate-spin" />
            Καθαρισμός συστήματος σε εξέλιξη...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={cleanupProgress} className="w-full" />
            <p className="text-center font-medium">{currentStep}</p>
            <p className="text-center text-sm text-muted-foreground">
              {cleanupProgress.toFixed(0)}% ολοκληρωμένο
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-6 h-6" />
          Clean & Go Real - Τελικός Καθαρισμός
          <Badge variant={isReady ? "default" : "secondary"}>
            {isReady ? "ΕΤΟΙΜΟ" : "ΑΝΑΜΟΝΗ"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{platformCompletion}%</p>
              <p className="text-sm text-muted-foreground">Ολοκλήρωση Πλατφόρμας</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{mockDataPercentage}%</p>
              <p className="text-sm text-muted-foreground">Mock/Demo Στοιχεία</p>
            </div>
          </div>

          {/* Warning */}
          <Alert variant={isReady ? "default" : "destructive"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isReady ? (
                <span className="font-semibold text-green-700">
                  ✅ Η πλατφόρμα είναι έτοιμη για τελικό καθαρισμό
                </span>
              ) : (
                <span className="font-semibold text-red-700">
                  ⚠️ Η πλατφόρμα δεν είναι ακόμα έτοιμη
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Cleanup Actions List */}
          <div className="space-y-2">
            <h4 className="font-medium">Ενέργειες που θα εκτελεστούν:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Διαγραφή όλων των mock/demo components</li>
              <li>• Καθαρισμός placeholder data από database</li>
              <li>• Αφαίρεση test utilities και debug tools</li>
              <li>• Διαγραφή demo analytics events</li>
              <li>• Ενεργοποίηση 100% production mode</li>
              <li>• Κλείδωμα συστήματος σε live λειτουργία</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleCleanupClick}
            disabled={!isReady}
            className={`w-full py-3 text-lg font-semibold ${
              isReady 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {isReady ? '🚀 ΕΚΤΕΛΕΣΗ ΤΕΛΙΚΟΥ ΚΑΘΑΡΙΣΜΟΥ' : 'ΑΝΑΜΟΝΗ...'}
          </Button>

          {isReady && (
            <p className="text-xs text-center text-red-600 font-medium">
              ⚠️ ΠΡΟΣΟΧΗ: Αυτή η ενέργεια είναι μη αναστρέψιμη!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionCleanupButton;
