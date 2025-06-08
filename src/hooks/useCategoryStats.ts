
import { useState, useEffect } from 'react';

interface CategoryStats {
  ancient: number;
  modern: number;
  error: number;
  graded: number;
  trending: number;
  european: number;
  american: number;
  asian: number;
  gold: number;
  silver: number;
  rare: number;
  auctions: number;
}

export const useCategoryStats = () => {
  const [stats, setStats] = useState<CategoryStats>({
    ancient: 0,
    modern: 0,
    error: 0,
    graded: 0,
    trending: 0,
    european: 0,
    american: 0,
    asian: 0,
    gold: 0,
    silver: 0,
    rare: 0,
    auctions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading and return mock stats
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock category stats - you can replace with real data
        setStats({
          ancient: 1250,
          modern: 3420,
          error: 89,
          graded: 567,
          trending: 245,
          european: 892,
          american: 1456,
          asian: 678,
          gold: 234,
          silver: 789,
          rare: 123,
          auctions: 45
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load category statistics');
        console.error('Category stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
};
