
import React, { Component, ReactNode } from 'react';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  showDetails?: boolean;
}

class ErrorBoundaryWrapper extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
                    <p className="text-sm">
                      An unexpected error occurred. Please try refreshing the page or return to the home page.
                    </p>
                  </div>
                  
                  {this.props.showDetails && this.state.error && (
                    <div className="bg-red-100 p-3 rounded text-xs font-mono">
                      <p className="font-semibold mb-1">Error Details:</p>
                      <p>{this.state.error.toString()}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={this.handleRetry} 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Try Again
                    </Button>
                    
                    <Button 
                      onClick={this.handleGoHome} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Home Page
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;
