
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useEnhancedVoiceCommands } from './useEnhancedVoiceCommands';

export const useAIVoiceAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { processCommand } = useEnhancedVoiceCommands();

  const processVoiceInput = useCallback(async (transcript: string, languageCode?: string, detectedLanguage?: string) => {
    setIsProcessing(true);
    console.log('Processing voice input:', transcript, 'Language:', languageCode, 'Detected:', detectedLanguage);

    try {
      // Process as a known voice command with language context
      const wasHandled = processCommand(transcript, languageCode || 'en-US');
      
      if (wasHandled) {
        setLastResponse('Command processed successfully');
        toast({
          title: "Voice Command",
          description: "Command processed successfully",
        });
      } else {
        // Simple fallback for unrecognized commands
        const lang = (languageCode || 'en-US').split('-')[0];
        const fallbackMessages: Record<string, string> = {
          'el': 'Δεν κατάλαβα την εντολή. Δοκιμάστε: "πήγαινε στην αγορά" ή "αναζήτηση για χρυσά νομίσματα"',
          'en': 'Command not recognized. Try: "go to marketplace" or "search for gold coins"',
          'es': 'Comando no reconocido. Intenta: "ir al mercado" o "buscar monedas de oro"',
          'fr': 'Commande non reconnue. Essayez: "aller au marché" ou "chercher des pièces d\'or"',
          'de': 'Befehl nicht erkannt. Versuchen Sie: "zum Marktplatz gehen" oder "nach Goldmünzen suchen"'
        };

        const message = fallbackMessages[lang] || fallbackMessages['en'];
        setLastResponse(message);
        
        toast({
          title: "Voice Assistant",
          description: message,
        });
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      
      const lang = (languageCode || 'en-US').split('-')[0];
      const errorMessages: Record<string, string> = {
        'el': 'Κάτι πήγε στραβά με την επεξεργασία της φωνής',
        'en': 'Something went wrong with voice processing',
        'es': 'Algo salió mal con el procesamiento de voz',
        'fr': 'Quelque chose s\'est mal passé avec le traitement vocal',
        'de': 'Etwas ist mit der Sprachverarbeitung schief gelaufen'
      };

      const message = errorMessages[lang] || errorMessages['en'];
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processCommand]);

  return {
    processVoiceInput,
    isProcessing,
    isListening,
    setIsListening,
    lastResponse
  };
};
