
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // Default to English (US)

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    // Note: Full translation system implementation would go here
    console.log(`Language switched to: ${language.name}`);
    document.documentElement.lang = language.code;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-coin-gold"
        aria-label="Select language"
      >
        <Globe size={18} />
        <span className="hidden md:inline">{currentLanguage.flag}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="max-h-60 overflow-y-auto py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`${
                  currentLanguage.code === language.code ? 'bg-gray-100' : ''
                } flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                aria-current={currentLanguage.code === language.code ? 'true' : 'false'}
              >
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
