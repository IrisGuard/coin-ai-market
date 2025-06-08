
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const NavigationBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (pathname: string, index: number) => {
    switch (pathname) {
      case 'marketplace':
        return 'Marketplace';
      case 'category':
        // Get the category name from the next path segment
        const categoryName = pathnames[index + 1];
        return categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) + ' Coins' : 'Category';
      case 'dashboard':
        return 'Dashboard';
      case 'profile':
        return 'Profile';
      case 'upload':
        return 'Upload';
      case 'auth':
        return 'Authentication';
      default:
        return pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
  };

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1 text-electric-blue hover:text-electric-purple">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {pathnames.map((value, index) => {
              // Skip showing individual category names in breadcrumb for category routes
              if (value === pathnames[pathnames.length - 1] && pathnames[pathnames.length - 2] === 'category') {
                return null;
              }
              
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1 || 
                            (index === pathnames.length - 2 && pathnames[pathnames.length - 2] === 'category');

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-gray-900 font-medium">
                        {getBreadcrumbName(value, index)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to} className="text-electric-blue hover:text-electric-purple">
                          {getBreadcrumbName(value, index)}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default NavigationBreadcrumb;
