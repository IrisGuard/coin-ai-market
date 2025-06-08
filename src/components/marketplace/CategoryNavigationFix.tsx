
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield, Crown, DollarSign, MapPin, AlertCircle, Gavel } from 'lucide-react';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { Button } from '@/components/ui/button';

const CategoryNavigationFix = () => {
  const { stats, loading, error } = useCategoryStats();

  const formatCount = (count: number) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // FIXED CATEGORIES - Correct routing paths
  const categories = [
    {
      name: 'Αρχαία Νομίσματα',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.ancient || 0),
      href: '/category/ancient',
      color: 'from-amber-400 to-orange-500',
      description: 'Προ του 1000 μ.Χ.'
    },
    {
      name: 'Μοντέρνα Νομίσματα',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.modern || 0),
      href: '/category/modern',
      color: 'from-blue-400 to-indigo-500',
      description: '1900+ νομίσματα'
    },
    {
      name: 'Error Νομίσματα',
      icon: <Star className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.error || 0),
      href: '/category/error',
      color: 'from-purple-400 to-pink-500',
      description: 'Σφάλματα κοπής'
    },
    {
      name: 'Live Auctions',
      icon: <Gavel className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.auctions || 0),
      href: '/auctions', // FIXED: Direct to auctions page
      color: 'from-red-400 to-rose-500',
      description: 'Ενεργές δημοπρασίες'
    },
    {
      name: 'Graded Νομίσματα',
      icon: <Shield className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.graded || 0),
      href: '/category/graded',
      color: 'from-green-400 to-emerald-500',
      description: 'PCGS/NGC πιστοποιημένα'
    },
    {
      name: 'Trending',
      icon: <TrendingUp className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.trending || 0),
      href: '/category/trending',
      color: 'from-orange-400 to-red-500',
      description: 'Δημοφιλή τώρα'
    },
    {
      name: 'Ευρωπαϊκά',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.european || 0),
      href: '/category/european',
      color: 'from-cyan-400 to-blue-500',
      description: 'Ευρωπαϊκά νομίσματα'
    },
    {
      name: 'Αμερικανικά',
      icon: <MapPin className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.american || 0),
      href: '/category/american',
      color: 'from-red-500 to-pink-500',
      description: 'ΗΠΑ/Καναδάς/Μεξικό'
    },
    {
      name: 'Ασιατικά',
      icon: <Globe className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.asian || 0),
      href: '/category/asian',
      color: 'from-yellow-400 to-orange-500',
      description: 'Ασιατικές χώρες'
    },
    {
      name: 'Χρυσά Νομίσματα',
      icon: <DollarSign className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.gold || 0),
      href: '/category/gold',
      color: 'from-yellow-500 to-amber-500',
      description: 'Περιεχόμενο χρυσού'
    },
    {
      name: 'Ασημένια Νομίσματα',
      icon: <Coins className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.silver || 0),
      href: '/category/silver',
      color: 'from-gray-400 to-slate-500',
      description: 'Περιεχόμενο ασημιού'
    },
    {
      name: 'Σπάνια',
      icon: <Crown className="w-6 h-6" />,
      count: loading ? '...' : formatCount(stats.rare || 0),
      href: '/category/rare',
      color: 'from-purple-500 to-indigo-600',
      description: 'Εξαιρετική σπανιότητα'
    }
  ];

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Αγορά ανά κατηγορία
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Αποτυχία φόρτωσης στατιστικών κατηγοριών</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Check if there are no coins at all
  const totalCoins = Object.values(stats).reduce((sum, count) => sum + (count || 0), 0);
  const isEmpty = !loading && totalCoins === 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Αγορά ανά κατηγορία
      </h2>
      
      {isEmpty && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Δεν υπάρχουν νομίσματα ακόμα - Προσθέστε δείγμα δεδομένων!</h3>
              <p className="text-sm text-blue-700">
                Πηγαίνετε στο Admin Panel → Sample Data Setup για να γεμίσετε όλες τις κατηγορίες με νομίσματα.
              </p>
            </div>
            <Button asChild size="sm" className="ml-auto">
              <Link to="/admin">Πηγαίνετε στο Admin</Link>
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.href}
            className="group text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              {category.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {category.name}
            </h3>
            <p className="text-xs text-gray-600 mb-1">
              {category.count}
            </p>
            <p className="text-xs text-gray-400">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
      
      {isEmpty && (
        <div className="text-center mt-8 py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            Όλες οι 12 κατηγορίες είναι έτοιμες - περιμένουν να προστεθούν νομίσματα!
          </p>
          <Button asChild>
            <Link to="/admin">
              Προσθήκη Δείγμα Δεδομένων Τώρα
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryNavigationFix;
