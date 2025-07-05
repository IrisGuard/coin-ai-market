'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface PhaseCompletionButtonProps {
  phase: number;
  nextPhase: number;
  completionPercentage: number;
  onProceed: () => void;
  isVisible?: boolean;
}

const PhaseCompletionButton: React.FC<PhaseCompletionButtonProps> = ({
  phase,
  nextPhase,
  completionPercentage,
  onProceed,
  isVisible = true
}) => {
  if (!isVisible || completionPercentage < 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Card className="border-2 border-green-200 bg-white shadow-2xl">
        <CardContent className="p-6">
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                '0 0 0 10px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
              <CheckCircle className="w-6 h-6" />
              <Sparkles className="w-5 h-5 animate-bounce-gentle" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Phase {phase} Complete! 🎉
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Advanced search, performance optimizations, and mobile experience ready
              </p>
              <div className="text-xs text-green-600 font-medium mb-4">
                ✅ {completionPercentage}% Functionality Complete
              </div>
            </div>

            <Button
              onClick={onProceed}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Proceed to Phase {nextPhase}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PhaseCompletionButton;