
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Globe } from 'lucide-react';
import { useMultiLanguageVoice } from '@/hooks/useMultiLanguageVoice';
import { getVoiceStatusMessages } from '@/utils/voiceStatusMessages';
import { cn } from '@/lib/utils';

const VoiceInterface = () => {
  const {
    isListening,
    isProcessing,
    isSupported,
    currentLanguage,
    lastResult,
    toggleListening
  } = useMultiLanguageVoice();

  if (!isSupported) {
    return null; // Don't show if voice recognition is not supported
  }

  const getLanguageDisplayName = (langCode: string): string => {
    const languageNames: Record<string, string> = {
      'el-GR': 'Ελληνικά',
      'en-US': 'English',
      'es-ES': 'Español',
      'fr-FR': 'Français',
      'de-DE': 'Deutsch',
      'it-IT': 'Italiano',
      'pt-PT': 'Português',
      'ru-RU': 'Русский',
      'zh-CN': '中文',
      'ja-JP': '日本語',
      'ko-KR': '한국어',
      'ar-SA': 'العربية',
      'hi-IN': 'हिन्दी',
      'tr-TR': 'Türkçe',
      'nl-NL': 'Nederlands',
      'pl-PL': 'Polski',
      'cs-CZ': 'Čeština',
      'sv-SE': 'Svenska',
      'no-NO': 'Norsk',
      'da-DK': 'Dansk',
      'fi-FI': 'Suomi',
      'he-IL': 'עברית',
      'th-TH': 'ไทย',
      'vi-VN': 'Tiếng Việt',
      'uk-UA': 'Українська',
      'ro-RO': 'Română',
      'hu-HU': 'Magyar',
      'bg-BG': 'Български',
      'hr-HR': 'Hrvatski',
      'sr-RS': 'Српски',
      'sl-SI': 'Slovenščina',
      'sk-SK': 'Slovenčina',
      'lt-LT': 'Lietuvių',
      'lv-LV': 'Latviešu',
      'et-EE': 'Eesti'
    };
    
    return languageNames[langCode] || 'English';
  };

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const buttonState = getButtonState();
  const statusMessages = getVoiceStatusMessages(currentLanguage);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
      {/* Language Indicator - Always show now since we detect language from start */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600">
            {getLanguageDisplayName(currentLanguage)}
          </span>
        </div>
      </div>

      {/* Last Search Result */}
      {lastResult && !isListening && !isProcessing && (
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg max-w-64">
          <div className="text-xs text-gray-500 mb-1">{statusMessages.lastSearch}</div>
          <div className="text-sm font-medium text-gray-800">
            "{lastResult.searchQuery}"
          </div>
          {lastResult.originalText !== lastResult.translatedText && (
            <div className="text-xs text-gray-500 mt-1">
              {statusMessages.original} "{lastResult.originalText}"
            </div>
          )}
        </div>
      )}

      {/* Voice Button */}
      <Button
        onClick={toggleListening}
        disabled={isProcessing}
        className={cn(
          "rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105",
          {
            'bg-red-500 hover:bg-red-600 text-white animate-pulse': buttonState === 'listening',
            'bg-blue-500 hover:bg-blue-600 text-white': buttonState === 'processing',
            'bg-electric-purple hover:bg-electric-purple/90 text-white': buttonState === 'idle'
          }
        )}
        size="lg"
      >
        {buttonState === 'processing' && <Loader2 className="w-6 h-6 animate-spin" />}
        {buttonState === 'listening' && <MicOff className="w-6 h-6" />}
        {buttonState === 'idle' && <Mic className="w-6 h-6" />}
      </Button>

      {/* Status Text - Now multilingual */}
      <div className="text-xs text-center w-full">
        {buttonState === 'listening' && (
          <span className="text-red-600 font-medium">{statusMessages.listening}</span>
        )}
        {buttonState === 'processing' && (
          <span className="text-blue-600 font-medium">{statusMessages.processing}</span>
        )}
        {buttonState === 'idle' && (
          <span className="text-gray-500">{statusMessages.idle}</span>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;
