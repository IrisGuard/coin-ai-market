import { useState, useCallback } from 'react';
import { useVoiceRecognition } from './useVoiceRecognition';
import { useGoogleTranslate } from './useGoogleTranslate';
import { useVoiceCommands } from './useVoiceCommands';
import { useAIVoiceAssistant } from './useAIVoiceAssistant';
import { toast } from './use-toast';

interface VoiceSearchResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  searchQuery: string;
}

export const useMultiLanguageVoice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [lastResult, setLastResult] = useState<VoiceSearchResult | null>(null);
  
  const { detectLanguage, translateText, getLanguageCode } = useGoogleTranslate();
  const { processCommand } = useVoiceCommands();
  const { processVoiceInput } = useAIVoiceAssistant();

  const processVoiceSearch = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    console.log('Processing voice search:', transcript);

    try {
      // Step 1: Detect language
      const detectedLang = await detectLanguage(transcript);
      console.log('Detected language:', detectedLang);

      // Step 2: Get proper language code for speech recognition
      const speechLangCode = getLanguageCode(detectedLang);
      setCurrentLanguage(speechLangCode);

      // Step 3: Check if it's a navigation command first
      const wasCommandHandled = processCommand(transcript);
      if (wasCommandHandled) {
        setIsProcessing(false);
        return;
      }

      // Step 4: Translate to English for search processing
      let searchQuery = transcript;
      let translatedText = transcript;
      
      if (detectedLang !== 'en' && detectedLang !== 'english') {
        const translation = await translateText(transcript, 'en', detectedLang);
        translatedText = translation.translatedText;
        searchQuery = translation.translatedText;
      }

      // Step 5: Extract search terms and process
      const processedQuery = extractSearchTerms(searchQuery);
      
      const result: VoiceSearchResult = {
        originalText: transcript,
        translatedText,
        detectedLanguage: detectedLang,
        searchQuery: processedQuery
      };

      setLastResult(result);

      // Step 6: Execute search
      if (processedQuery) {
        executeVoiceSearch(processedQuery);
        
        // Show feedback in original language
        const feedbackMessage = await getFeedbackMessage(detectedLang, processedQuery);
        toast({
          title: "🎤 Voice Search",
          description: feedbackMessage,
        });
      } else {
        // If no search terms, try AI assistant
        await processVoiceInput(transcript);
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
  }, [detectLanguage, translateText, getLanguageCode, processCommand, processVoiceInput]);

  const extractSearchTerms = useCallback((text: string): string => {
    const searchPatterns = [
      /(?:search|find|look for|show me|get me)\s+(.+)/i,
      /(?:coins?|currency|money)\s+(.+)/i,
      /(.+)\s+(?:coins?|currency|money)/i,
      /^(.+)$/i // Fallback: use entire text
    ];

    for (const pattern of searchPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return text.trim();
  }, []);

  const executeVoiceSearch = useCallback((query: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      // On homepage: fill search bar and navigate to marketplace
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    } else if (currentPath.includes('/marketplace')) {
      // On marketplace: update search filters
      const url = new URL(window.location.href);
      url.searchParams.set('search', query);
      window.history.pushState({}, '', url.toString());
      window.location.reload();
    } else {
      // Other pages: navigate to marketplace with search
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    }
  }, []);

  const getFeedbackMessage = useCallback(async (language: string, query: string): Promise<string> => {
    const messages: Record<string, string> = {
      'el': `Αναζήτηση για: "${query}"`,
      'en': `Searching for: "${query}"`,
      'es': `Buscando: "${query}"`,
      'fr': `Recherche de: "${query}"`,
      'de': `Suche nach: "${query}"`,
      'it': `Ricerca di: "${query}"`,
      'pt': `Procurando: "${query}"`,
      'ru': `Поиск: "${query}"`,
      'zh': `搜索: "${query}"`,
      'ja': `検索中: "${query}"`,
      'ko': `검색: "${query}"`,
      'ar': `البحث عن: "${query}"`,
      'hi': `खोज रहे हैं: "${query}"`,
      'tr': `Aranıyor: "${query}"`,
      'nl': `Zoeken naar: "${query}"`,
      'pl': `Wyszukiwanie: "${query}"`,
      'cs': `Hledání: "${query}"`,
      'sv': `Söker efter: "${query}"`,
      'no': `Søker etter: "${query}"`,
      'da': `Søger efter: "${query}"`,
      'fi': `Etsitään: "${query}"`,
      'he': `מחפש: "${query}"`,
      'th': `ค้นหา: "${query}"`,
      'vi': `Tìm kiếm: "${query}"`,
      'uk': `Пошук: "${query}"`,
      'ro': `Căutare: "${query}"`,
      'hu': `Keresés: "${query}"`,
      'bg': `Търсене: "${query}"`,
      'hr': `Pretraživanje: "${query}"`,
      'sr': `Претрага: "${query}"`,
      'sl': `Iskanje: "${query}"`,
      'sk': `Hľadanie: "${query}"`,
      'lt': `Paieška: "${query}"`,
      'lv': `Meklēšana: "${query}"`,
      'et': `Otsing: "${query}"`
    };

    return messages[language] || messages['en'];
  }, []);

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
