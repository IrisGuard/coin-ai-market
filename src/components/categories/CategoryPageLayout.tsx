
import React from 'react';
import Navbar from '@/components/Navbar';
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb';
import BackButton from '@/components/navigation/BackButton';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

interface CategoryPageLayoutProps {
  children: React.ReactNode;
}

const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NavigationBreadcrumb />
        
        <div className="pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <BackButton to="/marketplace" label="Back to Marketplace" />
          </div>
          {children}
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default CategoryPageLayout;
