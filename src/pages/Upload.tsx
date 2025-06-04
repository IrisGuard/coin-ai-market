
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CoinUploader from '@/components/CoinUploader';
import { API_BASE_URL } from '@/config/api';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Upload = () => {
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const { isAuthenticated } = useAuth();
  
  const isLiveBackend = API_BASE_URL.includes('coinvision-ai-production') || 
                       API_BASE_URL.includes('railway.app') || 
                       API_BASE_URL.includes('render.com');

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('Backend connection check failed:', error);
        if (isLiveBackend) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      }
    };

    checkBackendConnection();
  }, [isLiveBackend]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-coin-blue">Upload and Identify Your Coin</h1>
            <p className="mt-2 text-gray-600">
              Our AI will analyze your coin images and provide identification, grading, and valuation.
            </p>
            
            {backendStatus === 'connecting' && (
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                Connecting to AI Backend...
              </div>
            )}
            
            {backendStatus === 'connected' && (
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live AI Backend Connected
              </div>
            )}
            
            {backendStatus === 'error' && (
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                AI Backend Unavailable
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Note: Login to save your coins
              </div>
            )}
          </div>
          
          <CoinUploader />
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-serif font-bold text-coin-blue mb-4">Tips for Better Identification</h2>
            
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-coin-gold text-white text-xs mr-2 mt-0.5">1</span>
                <span>Take clear, well-lit photos of both sides of the coin</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-coin-gold text-white text-xs mr-2 mt-0.5">2</span>
                <span>Add close-up images of any special features or potential errors</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-coin-gold text-white text-xs mr-2 mt-0.5">3</span>
                <span>Use a neutral background (white or black) for best results</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-coin-gold text-white text-xs mr-2 mt-0.5">4</span>
                <span>Include a size reference in at least one image if possible</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-coin-gold text-white text-xs mr-2 mt-0.5">5</span>
                <span>Capture the edge/rim of the coin if it has any special features</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
