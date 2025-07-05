
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

export default EnhancedSearchBar;
