import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { multilingualCommands, matchCommand } from '@/utils/multilingualCommands';
import { getVoiceStatusMessages } from '@/utils/voiceStatusMessages';

export const useEnhancedVoiceCommands = () => {
  const navigate = useNavigate();

  const executeSearch = useCallback((searchTerm: string, languageCode: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      // On homepage: fill search bar and navigate to marketplace
      window.location.href = `/marketplace?search=${encodeURIComponent(searchTerm)}`;
    } else if (currentPath.includes('/marketplace')) {
      // On marketplace: update search filters
      const url = new URL(window.location.href);
      url.searchParams.set('search', searchTerm);
      window.history.pushState({}, '', url.toString());
      window.location.reload();
    } else {
      // Other pages: navigate to marketplace with search
      window.location.href = `/marketplace?search=${encodeURIComponent(searchTerm)}`;
    }

    const statusMessages = getVoiceStatusMessages(languageCode);
    const searchMessages: Record<string, string> = {
      'el': `Αναζήτηση για: ${searchTerm}`,
      'en': `Searching for: ${searchTerm}`,
      'es': `Buscando: ${searchTerm}`,
      'fr': `Recherche de: ${searchTerm}`,
      'de': `Suche nach: ${searchTerm}`,
      'it': `Ricerca di: ${searchTerm}`,
      'pt': `Procurando: ${searchTerm}`,
      'ru': `Поиск: ${searchTerm}`,
      'zh': `搜索: ${searchTerm}`,
      'ja': `検索中: ${searchTerm}`,
      'ko': `검색: ${searchTerm}`,
      'ar': `البحث عن: ${searchTerm}`,
      'hi': `खोज रहे हैं: ${searchTerm}`,
      'tr': `Aranıyor: ${searchTerm}`,
      'nl': `Zoeken naar: ${searchTerm}`,
      'pl': `Wyszukiwanie: ${searchTerm}`,
      'cs': `Hledání: ${searchTerm}`,
      'sv': `Söker efter: ${searchTerm}`,
      'no': `Søker etter: ${searchTerm}`,
      'da': `Søger efter: ${searchTerm}`,
      'fi': `Etsitään: ${searchTerm}`,
      'he': `מחפש: ${searchTerm}`,
      'th': `ค้นหา: ${searchTerm}`,
      'vi': `Tìm kiếm: ${searchTerm}`,
      'uk': `Пошук: ${searchTerm}`,
      'ro': `Căutare: ${searchTerm}`,
      'hu': `Keresés: ${searchTerm}`,
      'bg': `Търсене: ${searchTerm}`,
      'hr': `Pretraživanje: ${searchTerm}`,
      'sr': `Претрага: ${searchTerm}`,
      'sl': `Iskanje: ${searchTerm}`,
      'sk': `Hľadanie: ${searchTerm}`,
      'lt': `Paieška: ${searchTerm}`,
      'lv': `Meklēšana: ${searchTerm}`,
      'et': `Otsing: ${searchTerm}`
    };

    const lang = languageCode.split('-')[0];
    const message = searchMessages[lang] || searchMessages['en'];

    toast({
      title: "🎤 Voice Search",
      description: message,
    });
  }, []);

  const executeNavigation = useCallback((action: string, languageCode: string) => {
    const statusMessages = getVoiceStatusMessages(languageCode);
    const lang = languageCode.split('-')[0];

    const navigationMessages: Record<string, Record<string, string>> = {
      navigate_marketplace: {
        'el': 'Μετάβαση στο Marketplace',
        'en': 'Going to Marketplace',
        'es': 'Yendo al Mercado',
        'fr': 'Aller au Marché',
        'de': 'Gehe zum Marktplatz',
        'it': 'Andando al Mercato',
        'pt': 'Indo ao Mercado',
        'ru': 'Переход на Рынок',
        'zh': '前往市场',
        'ja': 'マーケットに移動中',
        'ko': '마켓으로 이동',
        'ar': 'الذهاب إلى السوق',
        'hi': 'बाजार में जा रहे हैं',
        'tr': 'Pazara Gidiliyor',
        'nl': 'Gaan naar Marktplaats',
        'pl': 'Przechodzenie na Rynek',
        'cs': 'Přechod na Trh',
        'sv': 'Går till Marknadsplats',
        'no': 'Går til Markedsplass',
        'da': 'Går til Markedsplads',
        'fi': 'Menossa Markkinapaikkaan',
        'he': 'הולך לשוק',
        'th': 'ไปยังตลาด',
        'vi': 'Đang đi đến Chợ',
        'uk': 'Перехід на Ринок',
        'ro': 'Merge la Piață',
        'hu': 'Megy a Piacra',
        'bg': 'Отива на Пазара',
        'hr': 'Idemo na Tržište',
        'sr': 'Иде на Тржиште',
        'sl': 'Grem na Tržišče',
        'sk': 'Ide na Trh',
        'lt': 'Einama į Rinką',
        'lv': 'Ejam uz Tirgu',
        'et': 'Minnes Turule'
      },
      navigate_home: {
        'el': 'Μετάβαση στην αρχική',
        'en': 'Going home',
        'es': 'Yendo a inicio',
        'fr': 'Retour à l\'accueil',
        'de': 'Gehe nach Hause',
        'it': 'Andando a casa',
        'pt': 'Indo para casa',
        'ru': 'Переход домой',
        'zh': '回到首页',
        'ja': 'ホームに移動中',
        'ko': '홈으로 이동',
        'ar': 'العودة للرئيسية',
        'hi': 'घर जा रहे हैं',
        'tr': 'Eve Gidiliyor',
        'nl': 'Gaan naar Huis',
        'pl': 'Przechodzenie do Domu',
        'cs': 'Přechod Domů',
        'sv': 'Går Hem',
        'no': 'Går Hjem',
        'da': 'Går Hjem',
        'fi': 'Menossa Kotiin',
        'he': 'הולך הביתה',
        'th': 'กลับบ้าน',
        'vi': 'Đang về nhà',
        'uk': 'Перехід додому',
        'ro': 'Merge Acasă',
        'hu': 'Megy Haza',
        'bg': 'Отива Вкъщи',
        'hr': 'Idemo Kući',
        'sr': 'Иде Кући',
        'sl': 'Grem Domov',
        'sk': 'Ide Domov',
        'lt': 'Einama Namo',
        'lv': 'Ejam Mājās',
        'et': 'Minnes Koju'
      }
    };

    switch (action) {
      case 'navigate_marketplace':
        navigate('/marketplace');
        break;
      case 'navigate_home':
        navigate('/');
        break;
      default:
        console.log('Unknown navigation action:', action);
        return false;
    }

    const message = navigationMessages[action]?.[lang] || navigationMessages[action]?.['en'] || 'Navigation';
    toast({
      title: "🧭 Navigation",
      description: message,
    });

    return true;
  }, [navigate]);

  const processCommand = useCallback((transcript: string, languageCode: string) => {
    const command = transcript.trim();
    console.log('Processing enhanced voice command:', command, 'Language:', languageCode);

    const matchResult = matchCommand(command, languageCode);
    
    if (matchResult) {
      const { command: cmd, match } = matchResult;
      console.log('Matched command:', cmd.action);

      switch (cmd.action) {
        case 'search':
          if (match[1]) {
            executeSearch(match[1].trim(), languageCode);
            return true;
          }
          break;
        case 'navigate_marketplace':
        case 'navigate_home':
          return executeNavigation(cmd.action, languageCode);
        default:
          console.log('Unknown command action:', cmd.action);
      }
    }

    // Command not recognized
    const lang = languageCode.split('-')[0];
    const unknownMessages: Record<string, string> = {
      'el': `Δεν κατάλαβα την εντολή: "${command}"`,
      'en': `Unknown command: "${command}"`,
      'es': `Comando desconocido: "${command}"`,
      'fr': `Commande inconnue: "${command}"`,
      'de': `Unbekannter Befehl: "${command}"`,
      'it': `Comando sconosciuto: "${command}"`,
      'pt': `Comando desconhecido: "${command}"`,
      'ru': `Неизвестная команда: "${command}"`,
      'zh': `未知命令: "${command}"`,
      'ja': `不明なコマンド: "${command}"`,
      'ko': `알 수 없는 명령: "${command}"`,
      'ar': `أمر غير معروف: "${command}"`,
      'hi': `अज्ञात आदेश: "${command}"`,
      'tr': `Bilinmeyen komut: "${command}"`,
      'nl': `Onbekende opdracht: "${command}"`,
      'pl': `Nieznane polecenie: "${command}"`,
      'cs': `Neznámý příkaz: "${command}"`,
      'sv': `Okänt kommando: "${command}"`,
      'no': `Ukjent kommando: "${command}"`,
      'da': `Ukendt kommando: "${command}"`,
      'fi': `Tuntematon komento: "${command}"`,
      'he': `פקודה לא ידועה: "${command}"`,
      'th': `คำสั่งที่ไม่รู้จัก: "${command}"`,
      'vi': `Lệnh không xác định: "${command}"`,
      'uk': `Невідома команда: "${command}"`,
      'ro': `Comandă necunoscută: "${command}"`,
      'hu': `Ismeretlen parancs: "${command}"`,
      'bg': `Неизвестна команда: "${command}"`,
      'hr': `Nepoznata naredba: "${command}"`,
      'sr': `Непозната команда: "${command}"`,
      'sl': `Neznan ukaz: "${command}"`,
      'sk': `Neznámy príkaz: "${command}"`,
      'lt': `Nežinoma komanda: "${command}"`,
      'lv': `Nezināma komanda: "${command}"`,
      'et': `Tundmatu käsk: "${command}"`
    };

    const message = unknownMessages[lang] || unknownMessages['en'];
    toast({
      title: "❓ Voice Command",
      description: message,
      variant: "destructive"
    });
    
    return false;
  }, [executeSearch, executeNavigation]);

  const getAvailableCommands = useCallback((languageCode: string) => {
    const lang = languageCode.split('-')[0];
    return multilingualCommands
      .filter(cmd => cmd.patterns[lang])
      .map(cmd => cmd.description[lang] || cmd.description['en'])
      .filter(Boolean);
  }, []);

  return {
    processCommand,
    getAvailableCommands
  };
};
