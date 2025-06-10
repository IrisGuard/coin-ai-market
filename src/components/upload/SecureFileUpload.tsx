
import React, { useState, useCallback } from 'react';
import { SecurityValidation } from '@/utils/securityValidation';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecureFileUploadProps {
  onFileValidated: (file: File) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

interface FileWithValidation {
  file: File;
  isValid: boolean;
  error?: string;
  progress: number;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileValidated,
  maxFiles = 5,
  accept = "image/*",
  className = ""
}) => {
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateFile = useCallback(async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    // Basic validation
    const basicValidation = SecurityValidation.validateFileUpload(file);
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // Magic number validation (async)
    return await SecurityValidation.validateFileUpload(file);
  }, []);

  const handleFiles = useCallback(async (fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    const newFiles: FileWithValidation[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileWithValidation: FileWithValidation = {
        file,
        isValid: false,
        progress: 0
      };

      newFiles.push(fileWithValidation);
      setFiles(prev => [...prev, fileWithValidation]);

      // Simulate progress during validation
      const progressInterval = setInterval(() => {
        fileWithValidation.progress = Math.min(fileWithValidation.progress + 10, 90);
        setFiles(prev => [...prev]);
      }, 100);

      try {
        const validation = await validateFile(file);
        fileWithValidation.isValid = validation.isValid;
        fileWithValidation.error = validation.error;
        fileWithValidation.progress = 100;

        if (validation.isValid) {
          onFileValidated(file);
          toast({
            title: "File Validated",
            description: `${file.name} passed security checks`,
          });
        } else {
          toast({
            title: "File Validation Failed",
            description: validation.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        fileWithValidation.isValid = false;
        fileWithValidation.error = 'Validation failed';
        fileWithValidation.progress = 100;
        
        toast({
          title: "Validation Error",
          description: `Failed to validate ${file.name}`,
          variant: "destructive",
        });
      } finally {
        clearInterval(progressInterval);
        setFiles(prev => [...prev]);
      }
    }

    setIsValidating(false);
  }, [files.length, maxFiles, onFileValidated, validateFile]);

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

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Files are automatically scanned for security threats. Only secure image files are accepted.
        </AlertDescription>
      </Alert>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          Maximum {maxFiles} files, 10MB each. Images only.
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
            Select Files
          </label>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">File Validation Status:</h4>
          {files.map((fileWithValidation, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 border rounded">
              <div className="flex-1">
                <p className="text-sm font-medium">{fileWithValidation.file.name}</p>
                <Progress value={fileWithValidation.progress} className="h-2 mt-1" />
                {fileWithValidation.error && (
                  <p className="text-xs text-red-500 mt-1">{fileWithValidation.error}</p>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {fileWithValidation.progress === 100 && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    fileWithValidation.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fileWithValidation.isValid ? 'Valid' : 'Invalid'}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
