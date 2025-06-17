
import { useState, useEffect } from 'react';
import { detectBrowserLanguage, getSpeechLanguageCode } from '@/utils/languageDetector';
import { useGoogleTranslate } from './useGoogleTranslate';

export const useVoiceLanguageManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const detection = detectBrowserLanguage();
    return detection.speechCode;
  });
  
  const { detectLanguage, translateText } = useGoogleTranslate();

  // Log detected language for debugging
  useEffect(() => {
    const detection = detectBrowserLanguage();
    console.log('Browser language detected:', navigator.language);
    console.log('Speech recognition language set to:', detection.speechCode);
    console.log('Language confidence:', detection.confidence);
  }, []);

  const processLanguageDetection = async (transcript: string) => {
    // Step 1: Detect language
    const detectedLangResult = await detectLanguage(transcript);
    console.log('Detected language:', detectedLangResult);

    // Extract language string from result object
    const detectedLang = detectedLangResult?.language || 'en';

    // Step 2: Get proper language code for speech recognition
    const speechLangCode = getSpeechLanguageCode(detectedLang);
    setCurrentLanguage(speechLangCode);

    // Step 3: Translate to English if needed
    let translatedText = transcript;
    
    if (detectedLang !== 'en' && detectedLang !== 'english') {
      const translation = await translateText(transcript, 'en', detectedLang);
      translatedText = translation?.translatedText || transcript;
    }

    return {
      detectedLanguage: detectedLang,
      speechLanguageCode: speechLangCode,
      originalText: transcript,
      translatedText
    };
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    processLanguageDetection
  };
};
