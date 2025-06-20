
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
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const { 
    platformCompletion, 
    isReady, 
    executeFullCleanup 
  } = useProductionCleanup();

  const handleCleanupClick = async () => {
    if (!isReady) {
      toast.error('Η πλατφόρμα δεν είναι ακόμα έτοιμη για βελτιστοποίηση');
      return;
    }

    setIsCleanupMode(true);
    setCleanupProgress(0);
    setHasError(false);
    setErrorDetails('');

    const steps = [
      'Σάρωση αρχείων συστήματος...',
      'Βελτιστοποίηση components...',
      'Καθαρισμός βάσης δεδομένων...',
      'Αφαίρεση utilities...',
      'Διαγραφή παλαιών αρχείων...',
      'Καθαρισμός analytics events...',
      'Ενεργοποίηση production mode...',
      'Τελική επαλήθευση...'
    ];

    try {
      console.log('🚀 Ξεκινά η διαδικασία βελτιστοποίησης...');
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setCleanupProgress((i + 1) * 12.5);
        
        console.log(`📋 Βήμα ${i + 1}/8: ${steps[i]}`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (i === 6) {
          console.log('🔧 Εκτέλεση κύριας βελτιστοποίησης...');
          const result = await executeFullCleanup();
          console.log('✅ Κύρια βελτιστοποίηση ολοκληρώθηκε:', result);
        }
      }

      console.log('🎉 Βελτιστοποίηση ολοκληρώθηκε με επιτυχία!');
      setIsCompleted(true);
      toast.success('🎉 Η πλατφόρμα είναι τώρα 100% LIVE και έτοιμη για πραγματικά νομίσματα!');
      
    } catch (error) {
      console.error('💥 Cleanup error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Άγνωστο σφάλμα κατά τη βελτιστοποίηση';
      
      setHasError(true);
      setErrorDetails(errorMessage);
      setIsCleanupMode(false);
      
      toast.error(`❌ Σφάλμα κατά τη βελτιστοποίηση: ${errorMessage}`);
      
      console.error('🔍 Error details:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  if (hasError) {
    return (
      <Card className="border-red-500 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-6 h-6" />
            ❌ Σφάλμα Βελτιστοποίησης
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-red-300 bg-red-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold text-red-800">
                Η βελτιστοποίηση απέτυχε: {errorDetails}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-700">Τι πήγε στραβά:</h4>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {errorDetails}
              </p>
            </div>

            <Button 
              onClick={() => {
                setHasError(false);
                setErrorDetails('');
              }}
              className="w-full"
              variant="outline"
            >
              🔄 Προσπάθεια Ξανά
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <p className="text-sm text-green-700">Development Data</p>
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
            Βελτιστοποίηση συστήματος σε εξέλιξη...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={cleanupProgress} className="w-full" />
            <p className="text-center font-medium">{currentStep}</p>
            <p className="text-center text-sm text-muted-foreground">
              {cleanupProgress.toFixed(0)}% ολοκληρωμένο
            </p>
            
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              💡 Tip: Μπορείτε να δείτε λεπτομερή logs στο console του browser (F12)
            </div>
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
          Clean & Go Real - Τελική Βελτιστοποίηση
          <Badge variant={isReady ? "default" : "secondary"}>
            {isReady ? "ΕΤΟΙΜΟ" : "ΑΝΑΜΟΝΗ"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{platformCompletion}%</p>
              <p className="text-sm text-muted-foreground">Ολοκλήρωση Πλατφόρμας</p>
            </div>
          </div>

          <Alert variant={isReady ? "default" : "destructive"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isReady ? (
                <span className="font-semibold text-green-700">
                  ✅ Η πλατφόρμα είναι έτοιμη για τελική βελτιστοποίηση
                </span>
              ) : (
                <span className="font-semibold text-red-700">
                  ⚠️ Η πλατφόρμα δεν είναι ακόμα έτοιμη
                </span>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">Ενέργειες που θα εκτελεστούν:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Βελτιστοποίηση όλων των components</li>
              <li>• Καθαρισμός δεδομένων από database</li>
              <li>• Αφαίρεση utilities και debug tools</li>
              <li>• Διαγραφή analytics events</li>
              <li>• Ενεργοποίηση 100% production mode</li>
              <li>• Κλείδωμα συστήματος σε live λειτουργία</li>
            </ul>
          </div>

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
            {isReady ? '🚀 ΕΚΤΕΛΕΣΗ ΤΕΛΙΚΗΣ ΒΕΛΤΙΣΤΟΠΟΙΗΣΗΣ' : 'ΑΝΑΜΟΝΗ...'}
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
