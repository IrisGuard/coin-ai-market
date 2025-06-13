
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Search, AlertTriangle, Eye } from 'lucide-react';
import { useEnhancedErrorKnowledge, useDetectCoinErrors } from '@/hooks/useEnhancedErrorKnowledge';
import { toast } from '@/hooks/use-toast';

const ConnectedErrorDetection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: errorKnowledge = [], isLoading } = useEnhancedErrorKnowledge();
  const detectErrors = useDetectCoinErrors();

  const filteredErrors = errorKnowledge.filter(error => 
    error.error_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    error.error_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetectErrors = async (imageUrl: string) => {
    try {
      setSelectedImage(imageUrl);
      const result = await detectErrors.mutateAsync({
        imageHash: 'test-hash-' + Date.now(),
        coinInfo: {
          keywords: ['error', 'coin'],
          category: 'unknown',
          type: 'detection'
        },
        detectionConfig: { min_confidence: 0.6 }
      });
      
      toast({
        title: "Error Detection Complete",
        description: "AI analysis completed successfully",
      });
    } catch (error) {
      console.error('Error detection failed:', error);
    }
  };

  const getRarityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-orange-100 text-orange-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Connected Error Detection System
            <Badge className="bg-red-100 text-red-800">Admin Brain Connected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorKnowledge.length}</div>
              <div className="text-sm text-muted-foreground">Known Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {errorKnowledge.filter(e => (e.rarity_score || 0) >= 8).length}
              </div>
              <div className="text-sm text-muted-foreground">Ultra Rare</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {errorKnowledge.filter(e => (e.detection_difficulty || 0) >= 7).length}
              </div>
              <div className="text-sm text-muted-foreground">Hard to Detect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {errorKnowledge.filter(e => (e.market_premium_multiplier || 0) > 3).length}
              </div>
              <div className="text-sm text-muted-foreground">High Premium</div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search error types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              onClick={() => handleDetectErrors('test-image-url')}
              disabled={detectErrors.isPending}
            >
              Test AI Detection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Coin Knowledge Base ({filteredErrors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{error.error_name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {error.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{error.error_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{error.error_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRarityColor(error.rarity_score)}>
                      {error.rarity_score || 0}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRarityColor(error.detection_difficulty)}>
                      {error.detection_difficulty || 0}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      {error.market_premium_multiplier ? `${error.market_premium_multiplier}x` : 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedErrorDetection;
