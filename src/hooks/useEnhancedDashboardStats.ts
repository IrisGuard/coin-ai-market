
import { useState, useEffect } from 'react';

interface PortfolioItem {
  id: string;
  name: string;
  value: number;
  image?: string;
}

interface DashboardStats {
  totalValue: number;
  profitPercentage: number;
  portfolioItems: PortfolioItem[];
}

export const useEnhancedDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: 15420,
    profitPercentage: 12.4,
    portfolioItems: [
      { id: '1', name: 'Morgan Silver Dollar', value: 450, image: '/placeholder.svg' },
      { id: '2', name: 'Mercury Dime', value: 120, image: '/placeholder.svg' },
      { id: '3', name: 'Buffalo Nickel', value: 85, image: '/placeholder.svg' }
    ]
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { stats, loading };
};
