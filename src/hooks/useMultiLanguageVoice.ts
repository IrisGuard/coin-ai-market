
import { useState, useCallback } from 'react';
import { useVoiceRecognition } from './useVoiceRecognition';
import { useEnhancedVoiceCommands } from './useEnhancedVoiceCommands';
import { useAIVoiceAssistant } from './useAIVoiceAssistant';
import { useVoiceLanguageManager } from './useVoiceLanguageManager';
import { useVoiceSearchProcessor } from './useVoiceSearchProcessor';
import { useVoiceFeedback } from './useVoiceFeedback';
import { toast } from './use-toast';

interface VoiceSearchResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  searchQuery: string;
}

export const useMultiLanguageVoice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<VoiceSearchResult | null>(null);
  
  const { currentLanguage } = useVoiceLanguageManager();
  const { processLanguageDetection } = useVoiceLanguageManager();
  const { extractSearchTerms, executeVoiceSearch } = useVoiceSearchProcessor();
  const { getFeedbackMessage } = useVoiceFeedback();
  const { processCommand } = useEnhancedVoiceCommands();
  const { processVoiceInput } = useAIVoiceAssistant();

  const processVoiceSearch = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    console.log('Processing voice search:', transcript);

    try {
      // Process language detection and translation
      const languageResult = await processLanguageDetection(transcript);
      const { detectedLanguage, speechLanguageCode, originalText, translatedText } = languageResult;

      // Check if it's a navigation command first (now multilingual)
      const wasCommandHandled = processCommand(transcript, speechLanguageCode);
      if (wasCommandHandled) {
        setIsProcessing(false);
        return;
      }

      // Extract search terms and process
      const processedQuery = extractSearchTerms(translatedText);
      
      const result: VoiceSearchResult = {
        originalText,
        translatedText,
        detectedLanguage,
        searchQuery: processedQuery
      };

      setLastResult(result);

      // Execute search or AI processing
      if (processedQuery) {
        executeVoiceSearch(processedQuery);
        
        // Show feedback in original language
        const feedbackMessage = await getFeedbackMessage(detectedLanguage, processedQuery);
        toast({
          title: "🎤 Voice Search",
          description: feedbackMessage,
        });
      } else {
        // If no search terms, try AI assistant
        await processVoiceInput(transcript, speechLanguageCode, detectedLanguage);
      }

    } catch (error) {
      console.error('Voice search processing error:', error);
      toast({
        title: "Voice Search Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processLanguageDetection, processCommand, extractSearchTerms, executeVoiceSearch, getFeedbackMessage, processVoiceInput]);

  const { 
    isListening, 
    isSupported, 
    startListening, 
    stopListening, 
    toggleListening 
  } = useVoiceRecognition({
    onResult: (result) => {
      if (result.isFinal) {
        processVoiceSearch(result.transcript);
      }
    },
    onError: (error) => {
      console.error('Voice recognition error:', error);
      toast({
        title: "Voice Recognition Error",
        description: "Could not capture voice input. Please try again.",
        variant: "destructive"
      });
    },
    language: currentLanguage,
    continuous: false,
    interimResults: true
  });

  return {
    isListening,
    isProcessing,
    isSupported,
    currentLanguage,
    lastResult,
    startListening,
    stopListening,
    toggleListening,
    processVoiceSearch
  };
};
