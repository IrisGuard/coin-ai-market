
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera } from 'lucide-react';

const EnhancedCoinUploadForm = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload submitted:', files);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          Upload Coin Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="photos">Coin Photos</Label>
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              Upload clear photos of both sides of your coin
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Files:</h4>
              {files.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {file.name}
                </div>
              ))}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={files.length === 0}>
            <Upload className="w-4 h-4 mr-2" />
            Start AI Analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoinUploadForm;
