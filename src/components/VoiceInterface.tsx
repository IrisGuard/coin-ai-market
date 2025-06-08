
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

const VoiceInterface = () => {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        className="bg-electric-purple hover:bg-electric-purple/90 text-white rounded-full p-3"
        size="sm"
      >
        <Mic className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default VoiceInterface;
