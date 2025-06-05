
export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

// Define the connection interface for non-standard navigator properties
interface NavigatorConnection {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
}

interface ExtendedNavigator extends Navigator {
  connection?: NavigatorConnection;
  mozConnection?: NavigatorConnection;
  webkitConnection?: NavigatorConnection;
}

export const compressImage = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    maxSizeKB = 500
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas to blob conversion failed'));
            return;
          }

          // Check if we need further compression
          const sizeKB = blob.size / 1024;
          
          if (sizeKB <= maxSizeKB) {
            // Size is acceptable
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            // Try with lower quality
            const newQuality = Math.max(0.1, quality * 0.8);
            
            canvas.toBlob(
              (secondBlob) => {
                if (!secondBlob) {
                  reject(new Error('Second compression failed'));
                  return;
                }

                const finalFile = new File([secondBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(finalFile);
              },
              'image/jpeg',
              newQuality
            );
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Image loading failed'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const getBandwidthQuality = (): CompressionOptions => {
  // Detect connection type if available
  const nav = navigator as ExtendedNavigator;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!connection) {
    // Default to medium quality if no connection info
    return {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      maxSizeKB: 300
    };
  }

  const effectiveType = connection.effectiveType;
  
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.5,
        maxSizeKB: 100
      };
    case '3g':
      return {
        maxWidth: 640,
        maxHeight: 640,
        quality: 0.6,
        maxSizeKB: 200
      };
    case '4g':
    default:
      return {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        maxSizeKB: 500
      };
  }
};

/**
 * Checks if the user is on a slow connection
 */
const isSlowConnection = (): boolean => {
  const nav = navigator as ExtendedNavigator;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (connection) {
    // Consider 2G or slow-2g as slow connections
    return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
  }
  
  // Default to false if connection API is not available
  return false;
};
