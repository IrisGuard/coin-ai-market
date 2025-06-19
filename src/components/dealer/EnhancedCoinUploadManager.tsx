
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { generateSecureId } from '@/utils/productionRandomUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadBatch {
  id: string;
  name: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: any[];
}

const EnhancedCoinUploadManager = () => {
  const [batches, setBatches] = useState<UploadBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    const newBatch: UploadBatch = {
      id: generateSecureId('batch'),
      name: `Batch ${new Date().toLocaleTimeString()}`,
      files,
      status: 'pending',
      progress: 0
    };

    setBatches(prev => [...prev, newBatch]);
    toast.success(`Added ${files.length} files to upload queue`);
  }, []);

  const processBatch = async (batchId: string) => {
    setIsProcessing(true);
    
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'processing', progress: 0 }
          : batch
      )
    );

    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    try {
      const results = [];
      
      for (let i = 0; i < batch.files.length; i++) {
        const file = batch.files[i];
        const progress = ((i + 1) / batch.files.length) * 100;
        
        // Update progress
        setBatches(prev => 
          prev.map(b => 
            b.id === batchId 
              ? { ...b, progress }
              : b
          )
        );

        // Upload file to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${generateSecureId('coin')}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('coin-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('coin-images')
          .getPublicUrl(fileName);

        // Process with AI recognition
        const { data: aiResult, error: aiError } = await supabase.functions
          .invoke('enhanced-dual-recognition', {
            body: { imageUrl: urlData.publicUrl }
          });

        if (aiError) {
          console.error('AI processing error:', aiError);
          continue;
        }

        results.push({
          fileName: file.name,
          imageUrl: urlData.publicUrl,
          aiResult: aiResult || {}
        });

        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setBatches(prev => 
        prev.map(batch => 
          batch.id === batchId 
            ? { 
                ...batch, 
                status: 'completed', 
                progress: 100,
                results 
              }
            : batch
        )
      );

      toast.success(`Batch processing completed: ${results.length} files processed`);
    } catch (error) {
      console.error('Batch processing failed:', error);
      
      setBatches(prev => 
        prev.map(batch => 
          batch.id === batchId 
            ? { ...batch, status: 'failed' }
            : batch
        )
      );

      toast.error('Batch processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: UploadBatch['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Upload className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadBatch['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enhanced Coin Upload Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload Coin Images</h3>
              <p className="text-muted-foreground mb-4">
                Select multiple images to create a new upload batch
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>Select Files</span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(batch.status)}
                      <div>
                        <h4 className="font-medium">{batch.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {batch.files.length} files
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                      {batch.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => processBatch(batch.id)}
                          disabled={isProcessing}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {batch.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{Math.round(batch.progress)}%</span>
                      </div>
                      <Progress value={batch.progress} />
                    </div>
                  )}

                  {batch.status === 'completed' && batch.results && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 font-medium">
                        ✅ Successfully processed {batch.results.length} images
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedCoinUploadManager;
