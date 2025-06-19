
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataPlaceholderProps {
  type?: 'loading' | 'error' | 'empty' | 'offline';
  title?: string;
  description?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const DataPlaceholder: React.FC<DataPlaceholderProps> = ({
  type = 'loading',
  title,
  description,
  onRetry,
  children,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'offline':
        return <Wifi className="w-12 h-12 text-gray-400" />;
      case 'empty':
        return <div className="w-12 h-12 text-4xl">📭</div>;
      default:
        return <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'error':
        return {
          title: title || 'Something went wrong',
          description: description || 'Unable to load data. Please try again.'
        };
      case 'offline':
        return {
          title: title || 'You\'re offline',
          description: description || 'Check your internet connection and try again.'
        };
      case 'empty':
        return {
          title: title || 'No data found',
          description: description || 'There\'s nothing to show here yet.'
        };
      default:
        return {
          title: title || 'Loading...',
          description: description || 'Please wait while we fetch your data.'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-sm">
          {content.description}
        </p>

        {children}

        {onRetry && (type === 'error' || type === 'offline') && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPlaceholder;
