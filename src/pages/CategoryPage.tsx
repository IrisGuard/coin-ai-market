
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryPageLayout from '@/components/categories/CategoryPageLayout';
import CategoryContent from '@/components/categories/CategoryContent';
import { useCategoryData } from '@/hooks/useCategoryData';
import { getCategoryTitle, getCategoryDescription } from '@/utils/categoryUtils';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // REDIRECT FIX: If accessing auctions category, redirect to auctions page
  useEffect(() => {
    if (category === 'auctions') {
      navigate('/auctions', { replace: true });
      return;
    }
  }, [category, navigate]);

  const {
    coins,
    categoryStats,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    isLoading
  } = useCategoryData(category || '');

  if (!category || category === 'auctions') {
    return null; // Will redirect
  }

  const categoryTitle = getCategoryTitle(category);
  const categoryDescription = getCategoryDescription(category);

  return (
    <CategoryPageLayout>
      <CategoryContent
        category={category}
        categoryTitle={categoryTitle}
        categoryDescription={categoryDescription}
        coins={coins}
        categoryStats={categoryStats}
        filters={filters}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLoading={isLoading}
      />
    </CategoryPageLayout>
  );
};

export default CategoryPage;
