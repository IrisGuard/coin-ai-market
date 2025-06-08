
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useVoiceCommands } from './useVoiceCommands';

export const useAIVoiceAssistant = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { processCommand } = useVoiceCommands();

  const processVoiceInput = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    console.log('Processing voice input:', transcript);

    try {
      // First try to process as a known voice command
      const wasHandled = processCommand(transcript);
      
      if (wasHandled) {
        setIsProcessing(false);
        return;
      }

      // If not a known command, send to AI for processing
      console.log('Sending to AI for processing:', transcript);
      
      const { data, error } = await supabase.functions.invoke('ai-voice-assistant', {
        body: {
          input: transcript,
          context: 'coin_marketplace_app',
          language: 'greek'
        }
      });

      if (error) {
        console.error('AI processing error:', error);
        toast({
          title: "Σφάλμα AI",
          description: "Δεν μπόρεσα να επεξεργαστώ την εντολή σου",
          variant: "destructive"
        });
        return;
      }

      if (data?.response) {
        setLastResponse(data.response);
        
        // Execute any actions returned by the AI
        if (data.actions && data.actions.length > 0) {
          for (const action of data.actions) {
            await executeAction(action);
          }
        }

        toast({
          title: "AI Assistant",
          description: data.response,
        });
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Σφάλμα",
        description: "Κάτι πήγε στραβά με την επεξεργασία της φωνής",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processCommand]);

  const executeAction = useCallback(async (action: any) => {
    console.log('Executing action:', action);
    
    switch (action.type) {
      case 'navigate':
        if (typeof window !== 'undefined') {
          window.location.href = action.url;
        }
        break;
      case 'search':
        if (typeof window !== 'undefined') {
          window.location.href = `/search?q=${encodeURIComponent(action.query)}`;
        }
        break;
      case 'toast':
        toast({
          title: action.title || "Ενημέρωση",
          description: action.message,
        });
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  }, []);

  return {
    processVoiceInput,
    isProcessing,
    isListening,
    setIsListening,
    lastResponse
  };
};
