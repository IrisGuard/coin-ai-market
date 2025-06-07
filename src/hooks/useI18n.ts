
import { useTheme } from '@/contexts/ThemeContext';

const translations = {
  en: {
    // Navigation
    'nav.marketplace': 'Marketplace',
    'nav.auctions': 'Auctions',
    'nav.search': 'Search',
    'nav.upload': 'Upload',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Marketplace
    'marketplace.title': 'Global Coin Marketplace',
    'marketplace.subtitle': 'Discover, buy and sell authenticated coins from collectors worldwide',
    'marketplace.search.placeholder': 'Search coins, years, countries, or descriptions...',
    'marketplace.stats.total': 'Total Coins',
    'marketplace.stats.auctions': 'Live Auctions',
    'marketplace.stats.featured': 'Featured',
    'marketplace.stats.totalValue': 'Total Value',
    'marketplace.filters.liveAuctions': 'Live Auctions',
    'marketplace.filters.featuredOnly': 'Featured Only',
    'marketplace.filters.condition': 'Condition',
    'marketplace.filters.allConditions': 'All Conditions',
    'marketplace.filters.sortBy': 'Sort By',
    'marketplace.filters.display': 'Display',
    'marketplace.filters.actions': 'Actions',
    'marketplace.filters.clearFilters': 'Clear Filters',
    'marketplace.filters.coinsFound': 'coins found',
    'marketplace.filters.loading': 'Loading...',
    'marketplace.noResults.title': 'No coins found',
    'marketplace.noResults.subtitle': 'Try different search criteria',
    'marketplace.coin.buyNow': 'Buy Now',
    'marketplace.coin.endingIn': 'Ending in',
    'marketplace.coin.views': 'views',
    'marketplace.coin.favorites': 'favorites',
    
    // Sort options
    'sort.newest': 'Newest First',
    'sort.popularity': 'Most Popular',
    'sort.priceLow': 'Price: Low to High',
    'sort.priceHigh': 'Price: High to Low',
    'sort.yearOld': 'Year: Oldest First',
    'sort.yearNew': 'Year: Newest First',
    'sort.name': 'Name: A to Z',
    
    // Toast messages
    'toast.addedToFavorites': 'Added to favorites',
    'toast.errorAdding': 'Error adding to favorites',
    'toast.errorLoading': 'Error loading coins'
  },
  el: {
    // Navigation
    'nav.marketplace': 'Αγορά',
    'nav.auctions': 'Δημοπρασίες',
    'nav.search': 'Αναζήτηση',
    'nav.upload': 'Ανέβασμα',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Έξοδος',
    'nav.login': 'Σύνδεση',
    
    // Marketplace
    'marketplace.title': 'Παγκόσμια Αγορά Νομισμάτων',
    'marketplace.subtitle': 'Ανακαλύψτε, αγοράστε και πουλήστε πιστοποιημένα νομίσματα από συλλέκτες παγκοσμίως',
    'marketplace.search.placeholder': 'Αναζήτηση νομισμάτων, ετών, χωρών...',
    'marketplace.stats.total': 'Σύνολο Νομισμάτων',
    'marketplace.stats.auctions': 'Ζωντανές Δημοπρασίες',
    'marketplace.stats.featured': 'Προτεινόμενα',
    'marketplace.stats.totalValue': 'Συνολική Αξία',
    'marketplace.filters.liveAuctions': 'Ζωντανές Δημοπρασίες',
    'marketplace.filters.featuredOnly': 'Μόνο Προτεινόμενα',
    'marketplace.filters.condition': 'Κατάσταση',
    'marketplace.filters.allConditions': 'Όλες οι Καταστάσεις',
    'marketplace.filters.sortBy': 'Ταξινόμηση',
    'marketplace.filters.display': 'Εμφάνιση',
    'marketplace.filters.actions': 'Ενέργειες',
    'marketplace.filters.clearFilters': 'Καθαρισμός Φίλτρων',
    'marketplace.filters.coinsFound': 'νομίσματα βρέθηκαν',
    'marketplace.filters.loading': 'Φόρτωση...',
    'marketplace.noResults.title': 'Δεν βρέθηκαν νομίσματα',
    'marketplace.noResults.subtitle': 'Δοκιμάστε διαφορετικά κριτήρια αναζήτησης',
    'marketplace.coin.buyNow': 'Άμεση Αγορά',
    'marketplace.coin.endingIn': 'Τελειώνει σε',
    'marketplace.coin.views': 'προβολές',
    'marketplace.coin.favorites': 'αγαπημένα',
    
    // Sort options
    'sort.newest': 'Νεότερα Πρώτα',
    'sort.popularity': 'Πιο Δημοφιλή',
    'sort.priceLow': 'Τιμή: Χαμηλή προς Υψηλή',
    'sort.priceHigh': 'Τιμή: Υψηλή προς Χαμηλή',
    'sort.yearOld': 'Έτος: Παλαιότερα Πρώτα',
    'sort.yearNew': 'Έτος: Νεότερα Πρώτα',
    'sort.name': 'Όνομα: Α προς Ω',
    
    // Toast messages
    'toast.addedToFavorites': 'Προστέθηκε στα αγαπημένα',
    'toast.errorAdding': 'Σφάλμα κατά την προσθήκη',
    'toast.errorLoading': 'Σφάλμα κατά τη φόρτωση των νομισμάτων'
  }
};

export const useI18n = () => {
  const { language } = useTheme();
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return { t, language };
};
