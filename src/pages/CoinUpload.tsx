
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Camera, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CoinUpload = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    grade: '',
    price: '',
    rarity: '',
    country: '',
    condition: '',
    description: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithAI = async () => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setAiAnalyzing(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('ai-coin-recognition', {
          body: { image: base64 }
        });

        if (error) throw error;

        setAiResults(data);
        
        // Auto-fill form with AI results
        if (data.success) {
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            year: data.year?.toString() || prev.year,
            country: data.country || prev.country,
            rarity: data.rarity || prev.rarity,
            grade: data.grade || prev.grade,
            price: data.estimated_value?.toString() || prev.price,
            description: data.description || prev.description,
            composition: data.composition || prev.composition
          }));

          toast({
            title: "AI Analysis Complete",
            description: `Coin identified as: ${data.name}`,
          });
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (error: any) {
      toast({
        title: "AI Analysis Failed", 
        description: "Using mock data for demo. " + error.message,
        variant: "destructive",
      });
      
      // Mock AI results for demo
      const mockResults = {
        success: true,
        name: "Morgan Silver Dollar",
        year: 1921,
        country: "United States",
        rarity: "Common",
        grade: "MS-63",
        estimated_value: 85,
        confidence: 0.92,
        description: "Morgan Silver Dollar minted in 1921, commonly found in good condition"
      };
      
      setAiResults(mockResults);
      setFormData(prev => ({
        ...prev,
        name: mockResults.name,
        year: mockResults.year.toString(),
        country: mockResults.country,
        rarity: mockResults.rarity,
        grade: mockResults.grade,
        price: mockResults.estimated_value.toString(),
        description: mockResults.description
      }));
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "Please login to upload coins",
        variant: "destructive",
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: "Error", 
        description: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('coin-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('coin-images')
        .getPublicUrl(fileName);

      // Insert coin data
      const { error: insertError } = await supabase
        .from('coins')
        .insert({
          name: formData.name,
          year: parseInt(formData.year),
          grade: formData.grade,
          price: parseFloat(formData.price),
          rarity: formData.rarity,
          country: formData.country,
          condition: formData.condition,
          description: formData.description,
          composition: formData.composition,
          diameter: formData.diameter ? parseFloat(formData.diameter) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          mint: formData.mint,
          image: publicUrl,
          user_id: user.id,
          authentication_status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Coin uploaded successfully! It will be reviewed by our team.",
      });

      navigate('/marketplace');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload coin: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">Please login to upload coins to the marketplace.</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Coin</h1>
            <p className="text-gray-600">Share your coin with collectors worldwide and get AI-powered insights</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Coin Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Click to upload coin image</p>
                      </div>
                    )}
                  </label>
                </div>
                
                {imagePreview && (
                  <Button 
                    type="button" 
                    onClick={analyzeWithAI}
                    disabled={aiAnalyzing}
                    className="w-full"
                  >
                    {aiAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                )}

                {aiResults && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">AI Analysis Results</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Identified as:</strong> {aiResults.name}</p>
                      <p><strong>Confidence:</strong> {(aiResults.confidence * 100).toFixed(1)}%</p>
                      <p><strong>Estimated Value:</strong> ${aiResults.estimated_value}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Coin Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mint">Mint</Label>
                  <Input
                    id="mint"
                    value={formData.mint}
                    onChange={(e) => setFormData({...formData, mint: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grading & Value */}
            <Card>
              <CardHeader>
                <CardTitle>Grading & Value</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grade *</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor (PO-1)</SelectItem>
                      <SelectItem value="Fair">Fair (FR-2)</SelectItem>
                      <SelectItem value="About Good">About Good (AG-3)</SelectItem>
                      <SelectItem value="Good">Good (G-4, G-6)</SelectItem>
                      <SelectItem value="Very Good">Very Good (VG-8, VG-10)</SelectItem>
                      <SelectItem value="Fine">Fine (F-12, F-15)</SelectItem>
                      <SelectItem value="Very Fine">Very Fine (VF-20, VF-25, VF-30, VF-35)</SelectItem>
                      <SelectItem value="Extremely Fine">Extremely Fine (EF-40, EF-45)</SelectItem>
                      <SelectItem value="About Uncirculated">About Uncirculated (AU-50, AU-53, AU-55, AU-58)</SelectItem>
                      <SelectItem value="Mint State">Mint State (MS-60 to MS-70)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Fine">Fine</SelectItem>
                      <SelectItem value="Very Fine">Very Fine</SelectItem>
                      <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                      <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                      <SelectItem value="Mint">Mint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rarity">Rarity *</Label>
                  <Select value={formData.rarity} onValueChange={(value) => setFormData({...formData, rarity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Uncommon">Uncommon</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Very Rare">Very Rare</SelectItem>
                      <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="composition">Composition</Label>
                  <Input
                    id="composition"
                    value={formData.composition}
                    onChange={(e) => setFormData({...formData, composition: e.target.value})}
                    placeholder="e.g., 90% Silver"
                  />
                </div>
                <div>
                  <Label htmlFor="diameter">Diameter (mm)</Label>
                  <Input
                    id="diameter"
                    type="number"
                    step="0.1"
                    value={formData.diameter}
                    onChange={(e) => setFormData({...formData, diameter: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your coin's history, provenance, or any special features..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Coin'
              )}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoinUpload;
