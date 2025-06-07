
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const demoSteps = [
  {
    id: 1,
    title: "Upload Image",
    description: "Take or upload a photo of your coin",
    icon: <Camera className="w-6 h-6" />,
    status: "completed"
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Our AI analyzes the coin in real-time",
    icon: <Zap className="w-6 h-6" />,
    status: "processing"
  },
  {
    id: 3,
    title: "Results",
    description: "Get identification, grade, and value",
    icon: <CheckCircle className="w-6 h-6" />,
    status: "pending"
  }
];

const sampleResults = {
  name: "1921 Morgan Silver Dollar",
  year: 1921,
  grade: "MS-63",
  value: "$52 - $68",
  confidence: 96.8,
  mint: "Philadelphia",
  composition: "90% Silver, 10% Copper",
  errors: ["None detected"],
  rarity: "Common"
};

const InteractiveAIDemo = () => {
  const [demoActive, setDemoActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startDemo = () => {
    setDemoActive(true);
    setCurrentStep(0);
    
    // Simulate the demo progression
    setTimeout(() => setCurrentStep(1), 1000);
    setTimeout(() => setCurrentStep(2), 3000);
    setTimeout(() => setCurrentStep(3), 5000);
  };

  const resetDemo = () => {
    setDemoActive(false);
    setCurrentStep(0);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-green-600">See AI </span>
            <span className="text-blue-600">In Action</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch our AI identify and analyze a coin in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Interactive Demo</h3>
            
            {/* Demo Steps */}
            <div className="space-y-4 mb-8">
              {demoSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    currentStep >= index 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep > index 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Controls */}
            <div className="flex space-x-4">
              {!demoActive ? (
                <Button
                  onClick={startDemo}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Start Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reset Demo
                </Button>
              )}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800">AI Analysis Results</h3>
            
            {currentStep >= 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-800">{sampleResults.name}</h4>
                    <div className="text-sm font-semibold text-green-600">
                      {sampleResults.confidence}% Confidence
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <span className="font-semibold ml-2">{sampleResults.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-semibold ml-2">{sampleResults.grade}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Value:</span>
                      <span className="font-semibold ml-2 text-green-600">{sampleResults.value}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mint:</span>
                      <span className="font-semibold ml-2">{sampleResults.mint}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Composition:</span>
                    <span className="font-semibold">{sampleResults.composition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rarity:</span>
                    <span className="font-semibold">{sampleResults.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Errors:</span>
                    <span className="font-semibold text-green-600">{sampleResults.errors[0]}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Results will appear here after analysis</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveAIDemo;
