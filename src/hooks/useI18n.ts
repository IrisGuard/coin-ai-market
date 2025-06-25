import { useState, useCallback } from 'react';

// Translation dictionaries for supported languages
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.stores': 'Stores',
    'nav.auctions': 'Auctions',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.dealer': 'Dealer',
    
    // Common actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Coin related
    'coin.name': 'Name',
    'coin.price': 'Price',
    'coin.year': 'Year',
    'coin.country': 'Country',
    'coin.grade': 'Grade',
    'coin.rarity': 'Rarity',
    'coin.category': 'Category',
    'coin.description': 'Description',
    
    // Forms
    'form.required': 'Required',
    'form.invalid': 'Invalid input',
    'form.submit': 'Submit',
    'form.reset': 'Reset',
    
    // Notifications
    'notification.success': 'Operation completed successfully',
    'notification.error': 'An error occurred',
    'notification.warning': 'Warning',
    'notification.info': 'Information',
  },
  
  el: {
    // Navigation (Greek)
    'nav.home': 'Αρχική',
    'nav.categories': 'Κατηγορίες',
    'nav.stores': 'Καταστήματα',
    'nav.auctions': 'Δημοπρασίες',
    'nav.profile': 'Προφίλ',
    'nav.dashboard': 'Πίνακας',
    'nav.admin': 'Διαχειριστής',
    'nav.dealer': 'Έμπορος',
    
    // Common actions (Greek)
    'common.save': 'Αποθήκευση',
    'common.cancel': 'Ακύρωση',
    'common.delete': 'Διαγραφή',
    'common.edit': 'Επεξεργασία',
    'common.view': 'Προβολή',
    'common.search': 'Αναζήτηση',
    'common.filter': 'Φίλτρο',
    'common.sort': 'Ταξινόμηση',
    'common.loading': 'Φόρτωση...',
    'common.error': 'Σφάλμα',
    'common.success': 'Επιτυχία',
    
    // Coin related (Greek)
    'coin.name': 'Όνομα',
    'coin.price': 'Τιμή',
    'coin.year': 'Έτος',
    'coin.country': 'Χώρα',
    'coin.grade': 'Βαθμός',
    'coin.rarity': 'Σπανιότητα',
    'coin.category': 'Κατηγορία',
    'coin.description': 'Περιγραφή',
    
    // Forms (Greek)
    'form.required': 'Απαιτείται',
    'form.invalid': 'Μη έγκυρη εισαγωγή',
    'form.submit': 'Υποβολή',
    'form.reset': 'Επαναφορά',
    
    // Notifications (Greek)
    'notification.success': 'Η λειτουργία ολοκληρώθηκε επιτυχώς',
    'notification.error': 'Παρουσιάστηκε σφάλμα',
    'notification.warning': 'Προειδοποίηση',
    'notification.info': 'Πληροφορία',
  }
};

type Language = 'en' | 'el';
type TranslationKey = keyof typeof translations.en;

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to English
    const saved = localStorage.getItem('coin-market-language');
    return (saved === 'el' || saved === 'en') ? saved : 'en';
  });

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('coin-market-language', language);
    // Optionally trigger a page reload or emit an event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }, []);

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const translation = translations[currentLanguage]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to English if translation not found in current language
    if (currentLanguage !== 'en') {
      const englishTranslation = translations.en[key];
      if (englishTranslation) {
        return englishTranslation;
      }
    }
    
    // Final fallback: return the provided fallback or the key itself
    return fallback || key;
  }, [currentLanguage]);

  const isRTL = currentLanguage === 'el' ? false : false; // Greek is LTR
  
  return { 
    t, 
    currentLanguage, 
    changeLanguage, 
    isRTL,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' }
    ] as const
  };
};
