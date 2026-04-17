import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import it from './locales/it.json';
import bg from './locales/bg.json';
import ro from './locales/ro.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', country: 'GB', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', country: 'DE', dir: 'ltr' },
  { code: 'fr', label: 'Français', country: 'FR', dir: 'ltr' },
  { code: 'es', label: 'Español', country: 'ES', dir: 'ltr' },
  { code: 'it', label: 'Italiano', country: 'IT', dir: 'ltr' },
  { code: 'bg', label: 'Български', country: 'BG', dir: 'ltr' },
  { code: 'ro', label: 'Română', country: 'RO', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', country: 'TR', dir: 'ltr' },
  { code: 'ar', label: 'العربية', country: 'SA', dir: 'rtl' },
  { code: 'zh', label: '中文', country: 'CN', dir: 'ltr' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      it: { translation: it },
      bg: { translation: bg },
      ro: { translation: ro },
      tr: { translation: tr },
      ar: { translation: ar },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'novacoin_lang',
    },
  });

// Apply direction on language change
i18n.on('languageChanged', (lng) => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === lng);
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang?.dir ?? 'ltr';
    document.documentElement.lang = lng;
  }
});

export default i18n;
