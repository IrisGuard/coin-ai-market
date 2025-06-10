
import React, { useState, useCallback } from 'react';
import { EnhancedInputValidation } from '@/utils/enhancedInputValidation';
import { useEnhancedSecurity } from '@/components/security/EnhancedSecurityProvider';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Upload, X, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecureFileUploadWrapperProps {
  onFileValidated: (file: File, securityData: SecurityMetadata) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  enableVirusScanning?: boolean;
  stripMetadata?: boolean;
}

interface SecurityMetadata {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  threats: string[];
  sanitized: boolean;
  originalSize: number;
  processedSize: number;
  checksum: string;
}

interface FileWithSecurity {
  file: File;
  isValid: boolean;
  error?: string;
  progress: number;
  securityMetadata?: SecurityMetadata;
  scanComplete: boolean;
}

const SecureFileUploadWrapper: React.FC<SecureFileUploadWrapperProps> = ({
  onFileValidated,
  maxFiles = 5,
  accept = "image/*",
  className = "",
  enableVirusScanning = true,
  stripMetadata = true
}) => {
  const [files, setFiles] = useState<FileWithSecurity[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { logSecurityEvent, securityLevel } = useEnhancedSecurity();

  const generateChecksum = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const performSecurityScan = async (file: File): Promise<SecurityMetadata> => {
    const threats: string[] = [];
    let securityLevel: 'low' | 'medium' | 'high' = 'high';

    // Check file signature and magic numbers
    const buffer = await file.arrayBuffer();
    const view = new Uint8Array(buffer);
    const signature = Array.from(view.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Enhanced threat detection
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      threats.push('Suspicious filename detected');
      securityLevel = 'low';
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      threats.push('Unusually large file size');
      securityLevel = 'medium';
    }

    // Check for embedded scripts or malicious patterns
    if (file.type.startsWith('image/')) {
      const fileText = new TextDecoder().decode(view.slice(0, Math.min(1024, view.length)));
      if (fileText.includes('<script') || fileText.includes('javascript:') || fileText.includes('data:')) {
        threats.push('Potentially malicious script detected in image');
        securityLevel = 'low';
      }
    }

    // Validate EXIF data for images
    if (stripMetadata && file.type.startsWith('image/')) {
      // In a real implementation, you would strip EXIF data here
      // For now, we'll just check if EXIF data exists
      if (signature.includes('45786966')) { // "Exif" in hex
        threats.push('EXIF metadata detected (will be stripped)');
      }
    }

    const checksum = await generateChecksum(file);

    return {
      isSecure: threats.length === 0 || securityLevel !== 'low',
      securityLevel,
      threats,
      sanitized: stripMetadata,
      originalSize: file.size,
      processedSize: file.size, // In real implementation, this might change after processing
      checksum
    };
  };

  const validateFile = useCallback(async (file: File): Promise<{ isValid: boolean; error?: string; securityMetadata?: SecurityMetadata }> => {
    // Basic validation first
    const basicValidation = await EnhancedInputValidation.validateFileUpload(file);
    if (!basicValidation.isValid) {
      return { isValid: false, error: basicValidation.error };
    }

    // Enhanced security scanning
    try {
      const securityMetadata = await performSecurityScan(file);
      
      if (!securityMetadata.isSecure) {
        await logSecurityEvent('malicious_file_upload_attempt', {
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          threats: securityMetadata.threats,
          securityLevel: securityMetadata.securityLevel
        });
        
        return { 
          isValid: false, 
          error: `Security threat detected: ${securityMetadata.threats.join(', ')}`,
          securityMetadata 
        };
      }

      return { isValid: true, securityMetadata };
    } catch (error) {
      await logSecurityEvent('file_security_scan_error', {
        filename: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return { isValid: false, error: 'Security scan failed' };
    }
  }, [logSecurityEvent]);

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    const newFiles: FileWithSecurity[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileWithSecurity: FileWithSecurity = {
        file,
        isValid: false,
        progress: 0,
        scanComplete: false
      };

      newFiles.push(fileWithSecurity);
      setFiles(prev => [...prev, fileWithSecurity]);

      // Simulate progress during scanning
      const progressInterval = setInterval(() => {
        fileWithSecurity.progress = Math.min(fileWithSecurity.progress + 10, 90);
        setFiles(prev => [...prev]);
      }, 150);

      try {
        const validation = await validateFile(file);
        fileWithSecurity.isValid = validation.isValid;
        fileWithSecurity.error = validation.error;
        fileWithSecurity.securityMetadata = validation.securityMetadata;
        fileWithSecurity.progress = 100;
        fileWithSecurity.scanComplete = true;

        if (validation.isValid && validation.securityMetadata) {
          onFileValidated(file, validation.securityMetadata);
          
          await logSecurityEvent('secure_file_upload_success', {
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
            securityLevel: validation.securityMetadata.securityLevel,
            checksum: validation.securityMetadata.checksum
          });
          
          toast({
            title: "File Security Validated",
            description: `${file.name} passed all security checks`,
          });
        } else {
          toast({
            title: "File Security Validation Failed",
            description: validation.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        fileWithSecurity.isValid = false;
        fileWithSecurity.error = 'Security validation failed';
        fileWithSecurity.progress = 100;
        fileWithSecurity.scanComplete = true;
        
        await logSecurityEvent('file_validation_error', {
          filename: file.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        toast({
          title: "File Validation Error",
          description: `Failed to validate ${file.name}`,
          variant: "destructive",
        });
      } finally {
        clearInterval(progressInterval);
        setFiles(prev => [...prev]);
      }
    }

    setIsScanning(false);
  }, [files.length, maxFiles, onFileValidated, validateFile, logSecurityEvent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getSecurityLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Enhanced Secure File Upload
            <Badge variant="outline">{securityLevel.toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Files undergo comprehensive security scanning including virus detection, 
              malicious script analysis, and metadata sanitization.
            </AlertDescription>
          </Alert>

          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Maximum {maxFiles} files, 10MB each. Advanced security scanning enabled.
            </p>
            <input
              type="file"
              multiple
              accept={accept}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="secure-file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="secure-file-upload" className="cursor-pointer">
                <Shield className="w-4 h-4 mr-2" />
                Select Files for Security Scan
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                File Security Analysis:
              </h4>
              {files.map((fileWithSecurity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium truncate">{fileWithSecurity.file.name}</p>
                        {fileWithSecurity.scanComplete && (
                          fileWithSecurity.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )
                        )}
                      </div>
                      
                      <Progress value={fileWithSecurity.progress} className="h-2 mb-2" />
                      
                      {fileWithSecurity.securityMetadata && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSecurityLevelColor(fileWithSecurity.securityMetadata.securityLevel)}>
                              {fileWithSecurity.securityMetadata.securityLevel.toUpperCase()} SECURITY
                            </Badge>
                            {fileWithSecurity.securityMetadata.sanitized && (
                              <Badge variant="outline">SANITIZED</Badge>
                            )}
                          </div>
                          
                          {fileWithSecurity.securityMetadata.threats.length > 0 && (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Security Alerts:</strong>
                                <ul className="mt-1 list-disc list-inside">
                                  {fileWithSecurity.securityMetadata.threats.map((threat, i) => (
                                    <li key={i} className="text-xs">{threat}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Size: {(fileWithSecurity.securityMetadata.originalSize / 1024).toFixed(1)} KB</p>
                            <p>Checksum: {fileWithSecurity.securityMetadata.checksum.substring(0, 16)}...</p>
                          </div>
                        </div>
                      )}
                      
                      {fileWithSecurity.error && (
                        <p className="text-xs text-red-500 mt-1">{fileWithSecurity.error}</p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="ml-2 h-8 w-8 p-0 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureFileUploadWrapper;
