
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface CoinViewer3DProps {
  obverseImage?: string;
  reverseImage?: string;
  model3dUrl?: string;
  name: string;
}

const CoinViewer3D = ({ obverseImage, reverseImage, model3dUrl, name }: CoinViewer3DProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState<'obverse' | 'reverse' | '3d'>('obverse');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInterval = useRef<number | null>(null);

  // Handle fullscreen functionality
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Auto-rotate functionality
  useEffect(() => {
    if (autoRotate && activeView === '3d') {
      viewerInterval.current = window.setInterval(() => {
        setRotationAngle(prev => (prev + 1) % 360);
      }, 50);
    } else if (viewerInterval.current) {
      clearInterval(viewerInterval.current);
      viewerInterval.current = null;
    }
    
    return () => {
      if (viewerInterval.current) {
        clearInterval(viewerInterval.current);
      }
    };
  }, [autoRotate, activeView]);

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [activeView]);

  // Get appropriate display image based on active view
  const getDisplayContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-coin-purple" />
          <p className="text-coin-purple font-medium">Loading {activeView} view...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'obverse':
        return (
          <motion.img 
            src={obverseImage} 
            alt={`${name} obverse`}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      case 'reverse':
        return (
          <motion.img 
            src={reverseImage} 
            alt={`${name} reverse`}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      case '3d':
        return model3dUrl ? (
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              style={{ 
                transform: `rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d'
              }}
              className="relative w-64 h-64"
            >
              <div className="absolute w-full h-full backface-hidden">
                <img 
                  src={obverseImage} 
                  alt={`${name} obverse`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div 
                className="absolute w-full h-full backface-hidden"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <img 
                  src={reverseImage || obverseImage} 
                  alt={`${name} reverse`}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600">3D model not available for this coin.</p>
            <button 
              className="mt-4 px-4 py-2 bg-coin-purple text-white rounded-lg"
              onClick={() => setActiveView('obverse')}
            >
              View Images
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`glassmorphism p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/90' : 'h-[500px]'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeView === 'obverse' ? 'bg-coin-purple text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('obverse');
            }}
          >
            Front
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeView === 'reverse' ? 'bg-coin-purple text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('reverse');
            }}
          >
            Back
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${activeView === '3d' ? 'bg-coin-purple text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('3d');
            }}
          >
            3D View
          </button>
        </div>
        
        <div className="flex space-x-2">
          {activeView === '3d' && (
            <button
              className={`px-3 py-1 rounded-full text-sm ${autoRotate ? 'bg-coin-purple text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              Auto-Rotate
            </button>
          )}
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      
      <div className={`flex items-center justify-center ${isFullscreen ? 'h-[calc(100%-60px)]' : 'h-[calc(500px-60px)]'}`}>
        {getDisplayContent()}
      </div>
    </div>
  );
};

export default CoinViewer3D;
