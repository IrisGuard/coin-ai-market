
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, X, Sparkles } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface EnhancedSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  showVoiceSearch?: boolean;
  showAISearch?: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "Search coins...",
  onSearch,
  initialValue = "",
  showVoiceSearch = false,
  showAISearch = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice search error. Please try again.');
    };

    recognition.start();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
          />
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-3">
          {showVoiceSearch && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleVoiceSearch}
              disabled={isListening}
              className={`px-4 py-4 ${isListening ? 'bg-red-50 border-red-200' : ''}`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} />
            </Button>
          )}

          {showAISearch && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
            </Button>
          )}

          <Button
            type="submit"
            size="lg"
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            Search
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default EnhancedSearchBar;
