
import { useCallback } from 'react';

export const useVoiceFeedback = () => {
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

  return {
    getFeedbackMessage
  };
};
