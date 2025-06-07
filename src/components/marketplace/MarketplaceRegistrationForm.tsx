
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  Shield, 
  Star, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Globe,
  CreditCard
} from 'lucide-react';

const MarketplaceRegistrationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    website: '',
    phoneNumber: '',
    businessAddress: '',
    taxId: '',
    yearsInBusiness: '',
    specialties: [] as string[],
    verificationDocuments: [] as File[],
    agreeToTerms: false,
    agreeToFees: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialtyOptions = [
    'Αρχαία Νομίσματα',
    'Νομίσματα ΗΠΑ',
    'Ευρωπαϊκά Νομίσματα',
    'Σπάνια Νομίσματα',
    'Αναμνηστικά Νομίσματα',
    'Νομίσματα Σφαλμάτων',
    'Πολύτιμα Μέταλλα',
    'Παγκόσμια Νομίσματα'
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        verificationDocuments: [...prev.verificationDocuments, ...newFiles]
      }));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Σφάλμα",
        description: "Πρέπει να είστε συνδεδεμένος για να υποβάλετε αίτηση",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Αίτηση Υποβλήθηκε!",
        description: "Η αίτησή σας για εγγραφή στο marketplace έχει υποβληθεί. Θα επικοινωνήσουμε μαζί σας σύντομα."
      });
      
      // Reset form
      setFormData({
        businessName: '',
        description: '',
        website: '',
        phoneNumber: '',
        businessAddress: '',
        taxId: '',
        yearsInBusiness: '',
        specialties: [],
        verificationDocuments: [],
        agreeToTerms: false,
        agreeToFees: false
      });
      setCurrentStep(1);
      
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα με την υποβολή της αίτησης",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.businessName && formData.description && formData.phoneNumber;
      case 2:
        return formData.businessAddress && formData.taxId && formData.yearsInBusiness;
      case 3:
        return formData.specialties.length > 0;
      case 4:
        return formData.agreeToTerms && formData.agreeToFees;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Store className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Εγγραφή στο Marketplace</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Γίνετε πιστοποιημένος έμπορος στην πλατφόρμα μας και προσεγγίστε χιλιάδες συλλέκτες νομισμάτων
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 ${
                  currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <Store className="w-5 h-5" />}
            {currentStep === 2 && <Shield className="w-5 h-5" />}
            {currentStep === 3 && <Star className="w-5 h-5" />}
            {currentStep === 4 && <CheckCircle className="w-5 h-5" />}
            {currentStep === 1 && "Βασικές Πληροφορίες"}
            {currentStep === 2 && "Επιχειρηματικά Στοιχεία"}
            {currentStep === 3 && "Ειδικότητες"}
            {currentStep === 4 && "Όροι & Συμφωνίες"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="businessName">Όνομα Επιχείρησης *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="π.χ. Premium Coins Store"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Περιγραφή Επιχείρησης *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Περιγράψτε την επιχείρησή σας και την εμπειρία σας..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Ιστότοπος</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Τηλέφωνο *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+30 210 123 4567"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="businessAddress">Διεύθυνση Επιχείρησης *</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Πλήρης διεύθυνση της επιχείρησής σας"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">ΑΦΜ *</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearsInBusiness">Έτη Λειτουργίας *</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="documents">Έγγραφα Πιστοποίησης</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Ανεβάστε έγγραφα πιστοποίησης (Άδεια λειτουργίας, Βεβαίωση ΑΦΜ κλπ.)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    Επιλογή Αρχείων
                  </Button>
                </div>
                {formData.verificationDocuments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {formData.verificationDocuments.length} αρχείο(α) επιλεγμένα
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Specialties */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label>Επιλέξτε τις Ειδικότητές σας *</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Επιλέξτε τους τομείς στους οποίους ειδικεύεστε
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialtyOptions.map((specialty) => (
                    <div
                      key={specialty}
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.specialties.includes(specialty)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={formData.specialties.includes(specialty)}
                          readOnly
                        />
                        <span className="text-sm">{specialty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Προτεινόμενες Ειδικότητες</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Η επιλογή συγκεκριμένων ειδικοτήτων θα σας βοηθήσει να προσεγγίσετε 
                      καλύτερα το κοινό-στόχο σας και να αυξήσετε τις πωλήσεις σας.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Terms & Agreements */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Προμήθειες & Κόστη
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Προμήθεια ανά πώληση:</span>
                    <span className="font-semibold">3.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Κόστος εγγραφής:</span>
                    <span className="font-semibold text-green-600">Δωρεάν</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Μηνιαίο κόστος συντήρησης:</span>
                    <span className="font-semibold text-green-600">Δωρεάν</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    Συμφωνώ με τους{' '}
                    <a href="#" className="text-purple-600 hover:underline">
                      Όρους Χρήσης
                    </a>{' '}
                    και την{' '}
                    <a href="#" className="text-purple-600 hover:underline">
                      Πολιτική Απορρήτου
                    </a>{' '}
                    της πλατφόρμας
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="fees"
                    checked={formData.agreeToFees}
                    onCheckedChange={(checked) => handleInputChange('agreeToFees', checked)}
                  />
                  <Label htmlFor="fees" className="text-sm leading-5">
                    Συμφωνώ με τη δομή προμηθειών και κατανοώ ότι θα χρεωθώ 3.5% για κάθε επιτυχημένη πώληση
                  </Label>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Επόμενα Βήματα</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Μετά την υποβολή της αίτησης, η ομάδα μας θα την εξετάσει εντός 3-5 εργάσιμων ημερών. 
                      Θα λάβετε email με την απόφαση και τις οδηγίες για την ενεργοποίηση του λογαριασμού σας.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Προηγούμενο
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid(currentStep)}
              >
                Επόμενο
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? 'Υποβολή...' : 'Υποβολή Αίτησης'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Παγκόσμια Εμβέλεια</h3>
            <p className="text-sm text-gray-600">
              Προσεγγίστε συλλέκτες από όλο τον κόσμο
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Ασφαλείς Συναλλαγές</h3>
            <p className="text-sm text-gray-600">
              Πλήρως ασφαλές σύστημα πληρωμών
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Υποστήριξη 24/7</h3>
            <p className="text-sm text-gray-600">
              Αφοσιωμένη ομάδα υποστήριξης εμπόρων
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketplaceRegistrationForm;
