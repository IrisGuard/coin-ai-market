
export interface MultilingualCommand {
  patterns: Record<string, RegExp[]>;
  action: string;
  description: Record<string, string>;
}

export const multilingualCommands: MultilingualCommand[] = [
  // Search commands
  {
    patterns: {
      'el': [/αναζήτηση (.+)/i, /ψάξε (.+)/i, /βρες (.+)/i],
      'en': [/search (.+)/i, /find (.+)/i, /look for (.+)/i],
      'es': [/buscar (.+)/i, /encontrar (.+)/i, /busca (.+)/i],
      'fr': [/chercher (.+)/i, /rechercher (.+)/i, /trouve (.+)/i],
      'de': [/suchen (.+)/i, /finden (.+)/i, /suche (.+)/i],
      'it': [/cercare (.+)/i, /trova (.+)/i, /cerca (.+)/i],
      'pt': [/procurar (.+)/i, /buscar (.+)/i, /encontrar (.+)/i],
      'ru': [/поиск (.+)/i, /найти (.+)/i, /искать (.+)/i],
      'zh': [/搜索 (.+)/i, /查找 (.+)/i, /寻找 (.+)/i],
      'ja': [/検索 (.+)/i, /探す (.+)/i, /見つける (.+)/i],
      'ko': [/검색 (.+)/i, /찾기 (.+)/i, /찾아 (.+)/i],
      'ar': [/بحث (.+)/i, /ابحث عن (.+)/i, /اعثر على (.+)/i],
      'hi': [/खोजें (.+)/i, /ढूंढें (.+)/i, /तलाश (.+)/i],
      'tr': [/ara (.+)/i, /bul (.+)/i, /arama (.+)/i],
      'nl': [/zoeken (.+)/i, /vinden (.+)/i, /zoek (.+)/i],
      'pl': [/szukaj (.+)/i, /znajdź (.+)/i, /wyszukaj (.+)/i],
      'cs': [/hledat (.+)/i, /najít (.+)/i, /vyhledat (.+)/i],
      'sv': [/sök (.+)/i, /hitta (.+)/i, /leta (.+)/i],
      'no': [/søk (.+)/i, /finn (.+)/i, /lete (.+)/i],
      'da': [/søg (.+)/i, /find (.+)/i, /lede (.+)/i],
      'fi': [/etsi (.+)/i, /löydä (.+)/i, /hae (.+)/i],
      'he': [/חפש (.+)/i, /מצא (.+)/i, /בחפש (.+)/i],
      'th': [/ค้นหา (.+)/i, /หา (.+)/i, /มองหา (.+)/i],
      'vi': [/tìm kiếm (.+)/i, /tìm (.+)/i, /tra cứu (.+)/i],
      'uk': [/шукати (.+)/i, /знайти (.+)/i, /пошук (.+)/i],
      'ro': [/căuta (.+)/i, /găsi (.+)/i, /caută (.+)/i],
      'hu': [/keresés (.+)/i, /találd (.+)/i, /keres (.+)/i],
      'bg': [/търси (.+)/i, /намери (.+)/i, /потърси (.+)/i],
      'hr': [/traži (.+)/i, /pronađi (.+)/i, /potraži (.+)/i],
      'sr': [/тражи (.+)/i, /пронађи (.+)/i, /потражи (.+)/i],
      'sl': [/išči (.+)/i, /najdi (.+)/i, /poišči (.+)/i],
      'sk': [/hľadať (.+)/i, /nájsť (.+)/i, /vyhľadať (.+)/i],
      'lt': [/ieškoti (.+)/i, /rasti (.+)/i, /paieška (.+)/i],
      'lv': [/meklēt (.+)/i, /atrast (.+)/i, /meklēšana (.+)/i],
      'et': [/otsi (.+)/i, /leia (.+)/i, /otsing (.+)/i]
    },
    action: 'search',
    description: {
      'el': 'Αναζήτηση [όρος] - Αναζητά νομίσματα',
      'en': 'Search [term] - Search for coins',
      'es': 'Buscar [término] - Buscar monedas',
      'fr': 'Chercher [terme] - Rechercher des pièces',
      'de': 'Suchen [Begriff] - Nach Münzen suchen',
      'it': 'Cerca [termine] - Cerca monete',
      'pt': 'Procurar [termo] - Procurar moedas',
      'ru': 'Поиск [термин] - Искать монеты',
      'zh': '搜索 [词条] - 搜索硬币',
      'ja': '検索 [用語] - コインを検索',
      'ko': '검색 [용어] - 동전 검색',
      'ar': 'بحث [مصطلح] - البحث عن العملات',
      'hi': 'खोजें [शब्द] - सिक्के खोजें',
      'tr': 'Ara [terim] - Para ara',
      'nl': 'Zoeken [term] - Zoek munten',
      'pl': 'Szukaj [termin] - Szukaj monet',
      'cs': 'Hledat [termín] - Hledat mince',
      'sv': 'Sök [term] - Sök mynt',
      'no': 'Søk [term] - Søk mynter',
      'da': 'Søg [term] - Søg mønter',
      'fi': 'Etsi [termi] - Etsi kolikoita',
      'he': 'חפש [מונח] - חפש מטבעות',
      'th': 'ค้นหา [คำ] - ค้นหาเหรียญ',
      'vi': 'Tìm kiếm [từ] - Tìm tiền xu',
      'uk': 'Шукати [термін] - Шукати монети',
      'ro': 'Căuta [termen] - Căuta monede',
      'hu': 'Keresés [kifejezés] - Érmék keresése',
      'bg': 'Търси [термин] - Търси монети',
      'hr': 'Traži [pojam] - Traži kovanice',
      'sr': 'Тражи [термин] - Тражи новчиће',
      'sl': 'Išči [izraz] - Išči kovance',
      'sk': 'Hľadať [výraz] - Hľadať mince',
      'lt': 'Ieškoti [terminas] - Ieškoti monetų',
      'lv': 'Meklēt [termins] - Meklēt monētas',
      'et': 'Otsi [termin] - Otsi münte'
    }
  },
  // Marketplace navigation commands
  {
    patterns: {
      'el': [/πήγαινε marketplace/i, /άνοιξε marketplace/i, /marketplace/i],
      'en': [/go to marketplace/i, /open marketplace/i, /marketplace/i],
      'es': [/ir al mercado/i, /abrir mercado/i, /mercado/i],
      'fr': [/aller au marché/i, /ouvrir marché/i, /marché/i],
      'de': [/gehe zum marktplatz/i, /öffne marktplatz/i, /marktplatz/i],
      'it': [/vai al mercato/i, /apri mercato/i, /mercato/i],
      'pt': [/ir ao mercado/i, /abrir mercado/i, /mercado/i],
      'ru': [/иди на рынок/i, /открыть рынок/i, /рынок/i],
      'zh': [/去市场/i, /打开市场/i, /市场/i],
      'ja': [/マーケットに行く/i, /マーケットを開く/i, /マーケット/i],
      'ko': [/마켓으로 가기/i, /마켓 열기/i, /마켓/i],
      'ar': [/اذهب إلى السوق/i, /افتح السوق/i, /السوق/i],
      'hi': [/बाजार जाएं/i, /बाजार खोलें/i, /बाजार/i],
      'tr': [/pazara git/i, /pazarı aç/i, /pazar/i],
      'nl': [/ga naar marktplaats/i, /open marktplaats/i, /marktplaats/i],
      'pl': [/idź na rynek/i, /otwórz rynek/i, /rynek/i],
      'cs': [/jdi na trh/i, /otevři trh/i, /trh/i],
      'sv': [/gå till marknadsplats/i, /öppna marknadsplats/i, /marknadsplats/i],
      'no': [/gå til markedsplass/i, /åpne markedsplass/i, /markedsplass/i],
      'da': [/gå til markedsplads/i, /åbn markedsplads/i, /markedsplads/i],
      'fi': [/mene markkinapaikalle/i, /avaa markkinapaikka/i, /markkinapaikka/i],
      'he': [/לך לשוק/i, /פתח שוק/i, /שוק/i],
      'th': [/ไปที่ตลาด/i, /เปิดตลาด/i, /ตลาด/i],
      'vi': [/đi đến chợ/i, /mở chợ/i, /chợ/i],
      'uk': [/йди на ринок/i, /відкрити ринок/i, /ринок/i],
      'ro': [/du-te la piață/i, /deschide piața/i, /piața/i],
      'hu': [/menj a piacra/i, /nyisd meg a piacot/i, /piac/i],
      'bg': [/отиди на пазара/i, /отвори пазара/i, /пазар/i],
      'hr': [/idi na tržište/i, /otvori tržište/i, /tržište/i],
      'sr': [/иди на тржиште/i, /отвори тржиште/i, /тржиште/i],
      'sl': [/pojdi na tržišče/i, /odpri tržišče/i, /tržišče/i],
      'sk': [/choď na trh/i, /otvor trh/i, /trh/i],
      'lt': [/eik į rinką/i, /atidaryk rinką/i, /rinka/i],
      'lv': [/ej uz tirgu/i, /atver tirgu/i, /tirgus/i],
      'et': [/mine turule/i, /ava turg/i, /turg/i]
    },
    action: 'navigate_marketplace',
    description: {
      'el': 'Πήγαινε marketplace - Μετάβαση στην αγορά',
      'en': 'Go to marketplace - Navigate to marketplace',
      'es': 'Ir al mercado - Navegar al mercado',
      'fr': 'Aller au marché - Naviguer vers le marché',
      'de': 'Gehe zum Marktplatz - Zum Marktplatz navigieren',
      'it': 'Vai al mercato - Naviga al mercato',
      'pt': 'Ir ao mercado - Navegar para o mercado',
      'ru': 'Иди на рынок - Перейти на рынок',
      'zh': '去市场 - 导航到市场',
      'ja': 'マーケットに行く - マーケットに移動',
      'ko': '마켓으로 가기 - 마켓으로 이동',
      'ar': 'اذهب إلى السوق - انتقل إلى السوق',
      'hi': 'बाजार जाएं - बाजार पर जाएं',
      'tr': 'Pazara git - Pazara git',
      'nl': 'Ga naar marktplaats - Navigeer naar marktplaats',
      'pl': 'Idź na rynek - Przejdź na rynek',
      'cs': 'Jdi na trh - Přejdi na trh',
      'sv': 'Gå till marknadsplats - Navigera till marknadsplats',
      'no': 'Gå til markedsplass - Naviger til markedsplass',
      'da': 'Gå til markedsplads - Naviger til markedsplads',
      'fi': 'Mene markkinapaikalle - Siirry markkinapaikkaan',
      'he': 'לך לשוק - נווט לשוק',
      'th': 'ไปที่ตลาด - นำทางไปยังตลาด',
      'vi': 'Đi đến chợ - Điều hướng đến chợ',
      'uk': 'Йди на ринок - Перейти на ринок',
      'ro': 'Du-te la piață - Navighează la piață',
      'hu': 'Menj a piacra - Navigálj a piacra',
      'bg': 'Отиди на пазара - Навигирай до пазара',
      'hr': 'Idi na tržište - Navigiraj na tržište',
      'sr': 'Иди на тржиште - Навигирај на тржиште',
      'sl': 'Pojdi na tržišče - Navigiraj na tržišče',
      'sk': 'Choď na trh - Naviguj na trh',
      'lt': 'Eik į rinką - Navigacijos į rinką',
      'lv': 'Ej uz tirgu - Navigē uz tirgu',
      'et': 'Mine turule - Navigeeri turule'
    }
  },
  // Home navigation commands
  {
    patterns: {
      'el': [/πήγαινε αρχική/i, /αρχική/i, /home/i],
      'en': [/go home/i, /home/i, /go to home/i],
      'es': [/ir a inicio/i, /inicio/i, /casa/i],
      'fr': [/aller à l'accueil/i, /accueil/i, /maison/i],
      'de': [/gehe nach hause/i, /startseite/i, /home/i],
      'it': [/vai a casa/i, /casa/i, /home/i],
      'pt': [/ir para casa/i, /casa/i, /início/i],
      'ru': [/иди домой/i, /домой/i, /главная/i],
      'zh': [/回家/i, /首页/i, /主页/i],
      'ja': [/ホームに行く/i, /ホーム/i, /家/i],
      'ko': [/홈으로 가기/i, /홈/i, /집/i],
      'ar': [/اذهب للرئيسية/i, /الرئيسية/i, /المنزل/i],
      'hi': [/घर जाएं/i, /घर/i, /मुख्य/i],
      'tr': [/eve git/i, /ana sayfa/i, /ev/i],
      'nl': [/ga naar huis/i, /thuis/i, /startpagina/i],
      'pl': [/idź do domu/i, /dom/i, /strona główna/i],
      'cs': [/jdi domů/i, /domů/i, /domovská stránka/i],
      'sv': [/gå hem/i, /hem/i, /startsida/i],
      'no': [/gå hjem/i, /hjem/i, /hjemmeside/i],
      'da': [/gå hjem/i, /hjem/i, /hjemmeside/i],
      'fi': [/mene kotiin/i, /koti/i, /etusivu/i],
      'he': [/לך הביתה/i, /בית/i, /עמוד ראשי/i],
      'th': [/กลับบ้าน/i, /บ้าน/i, /หน้าแรก/i],
      'vi': [/về nhà/i, /nhà/i, /trang chủ/i],
      'uk': [/йди додому/i, /додому/i, /головна/i],
      'ro': [/du-te acasă/i, /acasă/i, /pagina principală/i],
      'hu': [/menj haza/i, /haza/i, /főoldal/i],
      'bg': [/върви вкъщи/i, /вкъщи/i, /начална страница/i],
      'hr': [/idi kući/i, /kući/i, /početna stranica/i],
      'sr': [/иди кући/i, /кући/i, /почетна страница/i],
      'sl': [/pojdi domov/i, /domov/i, /domača stran/i],
      'sk': [/choď domov/i, /domov/i, /domovská stránka/i],
      'lt': [/eik namo/i, /namo/i, /pagrindinis puslapis/i],
      'lv': [/ej mājās/i, /mājās/i, /sākumlapa/i],
      'et': [/mine koju/i, /kodu/i, /avaleht/i]
    },
    action: 'navigate_home',
    description: {
      'el': 'Πήγαινε αρχική - Μετάβαση στην αρχική σελίδα',
      'en': 'Go home - Navigate to home page',
      'es': 'Ir a inicio - Navegar a la página de inicio',
      'fr': 'Aller à l\'accueil - Naviguer vers la page d\'accueil',
      'de': 'Gehe nach Hause - Zur Startseite navigieren',
      'it': 'Vai a casa - Naviga alla home page',
      'pt': 'Ir para casa - Navegar para a página inicial',
      'ru': 'Иди домой - Перейти на главную страницу',
      'zh': '回家 - 导航到主页',
      'ja': 'ホームに行く - ホームページに移動',
      'ko': '홈으로 가기 - 홈페이지로 이동',
      'ar': 'اذهب للرئيسية - انتقل للصفحة الرئيسية',
      'hi': 'घर जाएं - मुख्य पृष्ठ पर जाएं',
      'tr': 'Eve git - Ana sayfaya git',
      'nl': 'Ga naar huis - Navigeer naar startpagina',
      'pl': 'Idź do domu - Przejdź do strony głównej',
      'cs': 'Jdi domů - Přejdi na domovskou stránku',
      'sv': 'Gå hem - Navigera till startsidan',
      'no': 'Gå hjem - Naviger til hjemmesiden',
      'da': 'Gå hjem - Naviger til hjemmesiden',
      'fi': 'Mene kotiin - Siirry etusivulle',
      'he': 'לך הביתה - נווט לעמוד הראשי',
      'th': 'กลับบ้าน - นำทางไปยังหน้าแรก',
      'vi': 'Về nhà - Điều hướng đến trang chủ',
      'uk': 'Йди додому - Перейти на головну сторінку',
      'ro': 'Du-te acasă - Navighează la pagina principală',
      'hu': 'Menj haza - Navigálj a főoldalra',
      'bg': 'Върви вкъщи - Навигирай до началната страница',
      'hr': 'Idi kući - Navigiraj na početnu stranicu',
      'sr': 'Иди кући - Навигирај на почетну страницу',
      'sl': 'Pojdi domov - Navigiraj na domačo stran',
      'sk': 'Choď domov - Naviguj na domovskú stránku',
      'lt': 'Eik namo - Navigacijos į pagrindinį puslapį',
      'lv': 'Ej mājās - Navigē uz sākumlapu',
      'et': 'Mine koju - Navigeeri avalehele'
    }
  }
];

export const getCommandsForLanguage = (languageCode: string): MultilingualCommand[] => {
  const lang = languageCode.split('-')[0];
  return multilingualCommands.filter(command => command.patterns[lang]);
};

export const matchCommand = (transcript: string, languageCode: string): { command: MultilingualCommand; match: RegExpMatchArray } | null => {
  const lang = languageCode.split('-')[0];
  
  for (const command of multilingualCommands) {
    const patterns = command.patterns[lang];
    if (!patterns) continue;
    
    for (const pattern of patterns) {
      const match = transcript.match(pattern);
      if (match) {
        return { command, match };
      }
    }
  }
  
  return null;
};
