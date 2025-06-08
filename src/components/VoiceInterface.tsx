
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useAIVoiceAssistant } from '@/hooks/useAIVoiceAssistant';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInterface: React.FC = () => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const { 
    processVoiceInput, 
    isProcessing, 
    lastResponse,
    setIsListening: setAIListening 
  } = useAIVoiceAssistant();

  const {
    isListening,
    isSupported,
    transcript,
    toggleListening
  } = useVoiceRecognition({
    onResult: (result) => {
      setCurrentTranscript(result.transcript);
      setShowTranscript(true);
      
      if (result.isFinal && result.transcript.trim()) {
        console.log('Final transcript for AI:', result.transcript);
        processVoiceInput(result.transcript);
        
        // Hide transcript after processing
        setTimeout(() => {
          setShowTranscript(false);
          setCurrentTranscript('');
        }, 3000);
      }
    },
    onError: (error) => {
      toast({
        title: "Σφάλμα φωνητικής αναγνώρισης",
        description: `Σφάλμα: ${error}`,
        variant: "destructive"
      });
    },
    language: 'el-GR'
  });

  useEffect(() => {
    setAIListening(isListening);
  }, [isListening, setAIListening]);

  useEffect(() => {
    // Keyboard shortcut to activate voice (Ctrl+Space)
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault();
        toggleListening();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [toggleListening]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-24 right-8 z-50">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3">
            <p className="text-red-600 text-sm">
              Ο περιηγητής σας δεν υποστηρίζει φωνητική αναγνώριση
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end gap-3">
      {/* AI Response Display */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="max-w-sm"
          >
            <Card className="bg-blue-50 border-blue-200 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                  <p className="text-sm text-blue-800 font-medium">
                    {lastResponse}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {showTranscript && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="max-w-xs"
          >
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardContent className="p-3">
                <p className="text-sm text-gray-700">
                  "{currentTranscript}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            w-16 h-16 rounded-full shadow-lg transition-all duration-300
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : isProcessing
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-electric-blue hover:bg-electric-blue/90'
            }
            text-white
          `}
          title={
            isProcessing 
              ? 'Επεξεργάζομαι...' 
              : isListening 
              ? 'Σταμάτησε ακρόαση (Ctrl+Space)' 
              : 'Μίλησέ μου - θα κάνω ό,τι μου πεις! (Ctrl+Space)'
          }
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8"
            >
              ⚙️
            </motion.div>
          ) : (
            <svg
              className={`w-8 h-8 transition-all duration-300 ${isListening ? 'scale-110' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Button>
      </motion.div>

      {/* Processing indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-3 h-3 bg-white rounded-full"
          />
        </motion.div>
      )}

      {/* Listening indicator */}
      {isListening && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-3 h-3 bg-white rounded-full"
          />
        </motion.div>
      )}
    </div>
  );
};

export default VoiceInterface;
