
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Maximize2, Minimize2, RefreshCw, RotateCcw, ZoomIn, ZoomOut, X } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const coinRef = useRef<THREE.Mesh | null>(null);
  
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
  
  // Set up Three.js scene
  useEffect(() => {
    if (activeView !== '3d' || !canvasRef.current) return;
    
    setIsLoading(true);
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      (containerRef.current?.clientWidth || 500) / (containerRef.current?.clientHeight || 500), 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.setSize(
      containerRef.current?.clientWidth || 500, 
      containerRef.current?.clientHeight || 500
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-1, -1, 1);
    scene.add(pointLight);
    
    // Create orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;
    
    // Create a coin with both sides as textures
    if (obverseImage && reverseImage) {
      const textureLoader = new THREE.TextureLoader();
      
      // Load obverse texture
      textureLoader.load(obverseImage, (obverseTexture) => {
        // Load reverse texture
        textureLoader.load(reverseImage || obverseImage, (reverseTexture) => {
          // Create coin geometry (disc)
          const radius = 2;
          const segments = 64;
          const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, segments);
          
          // Create materials for each side
          const obverseMaterial = new THREE.MeshStandardMaterial({
            map: obverseTexture,
            metalness: 0.7,
            roughness: 0.3,
          });
          
          const reverseMaterial = new THREE.MeshStandardMaterial({
            map: reverseTexture,
            metalness: 0.7,
            roughness: 0.3,
          });
          
          const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Gold color for edge
            metalness: 0.8,
            roughness: 0.2,
          });
          
          // Create coin mesh with different materials for each face
          const materials = [
            edgeMaterial,
            obverseMaterial,
            reverseMaterial,
          ];
          
          const coin = new THREE.Mesh(geometry, materials);
          coin.rotation.x = Math.PI / 2; // Rotate to show face
          scene.add(coin);
          coinRef.current = coin;
          
          setIsLoading(false);
          
          // Animation loop
          const animate = () => {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              requestAnimationFrame(animate);
              if (controlsRef.current) controlsRef.current.update();
              rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
          };
          
          animate();
        });
      });
    } else {
      // If no images available, create a placeholder coin
      const geometry = new THREE.CylinderGeometry(2, 2, 0.1, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.7,
        roughness: 0.3
      });
      const coin = new THREE.Mesh(geometry, material);
      coin.rotation.x = Math.PI / 2;
      scene.add(coin);
      coinRef.current = coin;
      
      setIsLoading(false);
      
      // Animation loop
      const animate = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          requestAnimationFrame(animate);
          if (controlsRef.current) controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      animate();
    }
    
    // Handle resize
    const handleResize = () => {
      if (containerRef.current && cameraRef.current && rendererRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [activeView, obverseImage, reverseImage]);
  
  // Update auto-rotation setting
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);
  
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
  
  // Handle image loading for 2D view
  useEffect(() => {
    if (activeView !== '3d') {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [activeView]);
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
    if (cameraRef.current) {
      cameraRef.current.position.z = 5 / (zoomLevel + 0.2);
    }
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    if (cameraRef.current) {
      cameraRef.current.position.z = 5 / (zoomLevel - 0.2);
    }
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.rotation.set(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  // Get appropriate display content based on active view
  const getDisplayContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="h-12 w-12 rounded-full border-4 border-t-coin-purple border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
          <p className="text-coin-purple font-medium">Φόρτωση {activeView === 'obverse' ? 'εμπρόσθιας' : activeView === 'reverse' ? 'οπίσθιας' : 'τρισδιάστατης'} όψης...</p>
        </div>
      );
    }
    
    switch (activeView) {
      case 'obverse':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src={obverseImage} 
              alt={`${name} obverse`}
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        );
      case 'reverse':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src={reverseImage || obverseImage} 
              alt={`${name} reverse`}
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${zoomLevel})` }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        );
      case '3d':
        return (
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`glassmorphism ${isFullscreen ? 'fixed inset-0 z-[100] bg-black/90' : 'h-[500px]'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeView === 'obverse' 
                ? 'bg-gradient-to-r from-coin-purple to-coin-skyblue text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('obverse');
            }}
          >
            Εμπρός Όψη
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeView === 'reverse' 
                ? 'bg-gradient-to-r from-coin-purple to-coin-skyblue text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('reverse');
            }}
          >
            Πίσω Όψη
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeView === '3d' 
                ? 'bg-gradient-to-r from-coin-purple to-coin-skyblue text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setIsLoading(true);
              setActiveView('3d');
            }}
          >
            3D Προβολή
          </button>
        </div>
        
        <div className="flex space-x-2">
          {activeView === '3d' ? (
            <button
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                autoRotate 
                  ? 'bg-coin-orange text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RefreshCw size={16} className="mr-1 inline" />
              Αυτόματη Περιστροφή
            </button>
          ) : (
            <>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut size={18} />
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleReset}
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
      
      <div className={`${isFullscreen ? 'h-[calc(100%-68px)]' : 'h-[calc(500px-68px)]'} relative overflow-hidden`}>
        {getDisplayContent()}
        
        {isFullscreen && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            onClick={toggleFullscreen}
          >
            <X size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CoinViewer3D;
