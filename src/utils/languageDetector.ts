
export interface LanguageDetection {
  code: string;
  speechCode: string;
  confidence: number;
}

export const detectBrowserLanguage = (): LanguageDetection => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
  
  // Map browser language codes to speech recognition codes
  const languageMap: Record<string, string> = {
    'el': 'el-GR',
    'el-GR': 'el-GR',
    'el-CY': 'el-GR',
    'en': 'en-US',
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'es': 'es-ES',
    'es-ES': 'es-ES',
    'es-MX': 'es-MX',
    'fr': 'fr-FR',
    'fr-FR': 'fr-FR',
    'fr-CA': 'fr-CA',
    'de': 'de-DE',
    'de-DE': 'de-DE',
    'it': 'it-IT',
    'it-IT': 'it-IT',
    'pt': 'pt-PT',
    'pt-PT': 'pt-PT',
    'pt-BR': 'pt-BR',
    'ru': 'ru-RU',
    'ru-RU': 'ru-RU',
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'ja': 'ja-JP',
    'ja-JP': 'ja-JP',
    'ko': 'ko-KR',
    'ko-KR': 'ko-KR',
    'ar': 'ar-SA',
    'ar-SA': 'ar-SA',
    'hi': 'hi-IN',
    'hi-IN': 'hi-IN',
    'tr': 'tr-TR',
    'tr-TR': 'tr-TR',
    'nl': 'nl-NL',
    'nl-NL': 'nl-NL',
    'pl': 'pl-PL',
    'pl-PL': 'pl-PL',
    'cs': 'cs-CZ',
    'cs-CZ': 'cs-CZ',
    'sv': 'sv-SE',
    'sv-SE': 'sv-SE',
    'no': 'no-NO',
    'no-NO': 'no-NO',
    'da': 'da-DK',
    'da-DK': 'da-DK',
    'fi': 'fi-FI',
    'fi-FI': 'fi-FI',
    'he': 'he-IL',
    'he-IL': 'he-IL',
    'th': 'th-TH',
    'th-TH': 'th-TH',
    'vi': 'vi-VN',
    'vi-VN': 'vi-VN',
    'uk': 'uk-UA',
    'uk-UA': 'uk-UA',
    'ro': 'ro-RO',
    'ro-RO': 'ro-RO',
    'hu': 'hu-HU',
    'hu-HU': 'hu-HU',
    'bg': 'bg-BG',
    'bg-BG': 'bg-BG',
    'hr': 'hr-HR',
    'hr-HR': 'hr-HR',
    'sr': 'sr-RS',
    'sr-RS': 'sr-RS',
    'sl': 'sl-SI',
    'sl-SI': 'sl-SI',
    'sk': 'sk-SK',
    'sk-SK': 'sk-SK',
    'lt': 'lt-LT',
    'lt-LT': 'lt-LT',
    'lv': 'lv-LV',
    'lv-LV': 'lv-LV',
    'et': 'et-EE',
    'et-EE': 'et-EE'
  };

  // First try exact match
  if (languageMap[browserLang]) {
    return {
      code: browserLang.split('-')[0],
      speechCode: languageMap[browserLang],
      confidence: 1.0
    };
  }

  // Try language code without region
  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) {
    return {
      code: langCode,
      speechCode: languageMap[langCode],
      confidence: 0.9
    };
  }

  // Fallback to English
  return {
    code: 'en',
    speechCode: 'en-US',
    confidence: 0.5
  };
};

export const getSpeechLanguageCode = (detectedLanguage: string): string => {
  const languageMap: Record<string, string> = {
    'greek': 'el-GR',
    'english': 'en-US',
    'spanish': 'es-ES',
    'french': 'fr-FR',
    'german': 'de-DE',
    'italian': 'it-IT',
    'portuguese': 'pt-PT',
    'russian': 'ru-RU',
    'chinese': 'zh-CN',
    'japanese': 'ja-JP',
    'korean': 'ko-KR',
    'arabic': 'ar-SA',
    'hindi': 'hi-IN',
    'turkish': 'tr-TR',
    'dutch': 'nl-NL',
    'polish': 'pl-PL',
    'czech': 'cs-CZ',
    'swedish': 'sv-SE',
    'norwegian': 'no-NO',
    'danish': 'da-DK',
    'finnish': 'fi-FI',
    'hebrew': 'he-IL',
    'thai': 'th-TH',
    'vietnamese': 'vi-VN',
    'ukrainian': 'uk-UA',
    'romanian': 'ro-RO',
    'hungarian': 'hu-HU',
    'bulgarian': 'bg-BG',
    'croatian': 'hr-HR',
    'serbian': 'sr-RS',
    'slovenian': 'sl-SI',
    'slovak': 'sk-SK',
    'lithuanian': 'lt-LT',
    'latvian': 'lv-LV',
    'estonian': 'et-EE'
  };

  return languageMap[detectedLanguage.toLowerCase()] || 'en-US';
};
