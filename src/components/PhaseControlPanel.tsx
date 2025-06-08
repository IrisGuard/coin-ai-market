
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Play, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Upload,
  Brain,
  Grid,
  User,
  Store,
  Shield,
  Smartphone,
  Key,
  TestTube
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Phase {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
  message: string;
}

const initialPhases: Phase[] = [
  {
    id: 1,
    title: "Αρχική Σελίδα & Navigation",
    description: "Landing page, navbar, search, env keys, real numbers",
    icon: <Settings className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 1: Φτιάξε την αρχική σελίδα ως πλήρη landing page. Έλεγξε το Navbar σε όλες τις οθόνες, σύνδεσε το search bar με AI modules, εμφάνισε πραγματικούς αριθμούς από Supabase στις κατηγορίες, και βεβαιώσου ότι το Get Started button οδηγεί στο /auth."
  },
  {
    id: 2,
    title: "Upload System",
    description: "Square images, background validation, multi-upload, responsive",
    icon: <Upload className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 2: Δημιούργησε ολοκληρωμένο Upload System που δέχεται μόνο τετράγωνες φωτογραφίες (1000x1000px), με λευκό φόντο, μέχρι 10 φωτογραφίες ανά νόμισμα. Να λειτουργεί από κινητό και desktop με drag & drop, camera integration και AI background removal."
  },
  {
    id: 3,
    title: "AI Integration & Recognition",
    description: "Real-time AI analysis, auto-fill, confidence scoring",
    icon: <Brain className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 3: Ενσωμάτωσε πλήρη AI coin recognition που αναλύει αυτόματα μετά το upload και συμπληρώνει: grade, country, year, material, errors, value. Προσθήκη AI-suggested categories και confidence scoring με cache system."
  },
  {
    id: 4,
    title: "Dynamic Category Routes",
    description: "12 κατηγορίες, filtering, sorting per category",
    icon: <Grid className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 4: Δημιούργησε 12 δυναμικές κατηγορίες (/category/ancient, /category/gold, κλπ) με filtering και sorting ανά κατηγορία. Κάθε κατηγορία να έχει δικό της layout και specialized displays."
  },
  {
    id: 5,
    title: "User Panel Enhancement",
    description: "Upload management, preview, edit/delete, listing controls",
    icon: <User className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 5: Ενισχύστε το User Panel με upload button, preview uploaded coins, edit/delete functionality, listing management (Buy Now/Auction), και store management capabilities."
  },
  {
    id: 6,
    title: "Marketplace Public View",
    description: "Verified dealers, store pages, public browsing",
    icon: <Store className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 6: Φτιάξε το public Marketplace που εμφανίζει verified dealers, store pages με custom URLs, public coin browsing και ισχυρό search/filtering system."
  },
  {
    id: 7,
    title: "Admin Panel Full Power",
    description: "Real-time monitoring, AI analytics, system health",
    icon: <Shield className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 7: Ολοκλήρωσε το Admin Panel με real-time monitoring dashboard, AI analytics, error logs management, system health checks και export functionality για όλες τις αναλύσεις."
  },
  {
    id: 8,
    title: "Mobile Optimization",
    description: "Camera integration, touch UI, PWA features",
    icon: <Smartphone className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 8: Βελτιστοποίησε για κινητά με camera integration, touch-friendly interface, offline capabilities και Progressive Web App features για πλήρη mobile experience."
  },
  {
    id: 9,
    title: "Complete Auth Flow",
    description: "Signup flow, permissions, RLS validation",
    icon: <Key className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 9: Ολοκλήρωσε το Auth Flow (Signup → Profile creation → Auto-login), upload flow testing, RLS policies validation και permission testing για πλήρη ασφάλεια."
  },
  {
    id: 10,
    title: "Final Integration Testing",
    description: "End-to-end testing, performance, production ready",
    icon: <TestTube className="w-4 h-4" />,
    status: 'pending',
    message: "Φάση 10: Εκτέλεσε πλήρη end-to-end testing, performance optimization, edge function connectivity, API keys validation και final production readiness checks."
  }
];

const PhaseControlPanel = () => {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<number | null>(null);

  // Load phase status from localStorage
  useEffect(() => {
    const savedPhases = localStorage.getItem('coinvision-phases');
    if (savedPhases) {
      setPhases(JSON.parse(savedPhases));
    }
  }, []);

  // Save phase status to localStorage
  const savePhases = (newPhases: Phase[]) => {
    setPhases(newPhases);
    localStorage.setItem('coinvision-phases', JSON.stringify(newPhases));
  };

  const executePhase = (phaseId: number) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    setCurrentPhase(phaseId);
    
    // Update phase status to in-progress
    const updatedPhases = phases.map(p => 
      p.id === phaseId ? { ...p, status: 'in-progress' as const } : p
    );
    savePhases(updatedPhases);

    // Send the phase message
    const event = new CustomEvent('sendChatMessage', { 
      detail: { message: phase.message } 
    });
    window.dispatchEvent(event);

    // Mark as completed after a short delay (simulating execution)
    setTimeout(() => {
      const completedPhases = phases.map(p => 
        p.id === phaseId ? { ...p, status: 'completed' as const } : p
      );
      savePhases(completedPhases);
      setCurrentPhase(null);
    }, 2000);
  };

  const resetProgress = () => {
    const resetPhases = phases.map(p => ({ ...p, status: 'pending' as const }));
    savePhases(resetPhases);
    setCurrentPhase(null);
  };

  const completedCount = phases.filter(p => p.status === 'completed').length;
  const progressPercentage = (completedCount / phases.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (isActive) return <Play className="w-4 h-4 animate-pulse" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4" />;
    return <Circle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 max-w-md"
    >
      <Card className="border-2 border-electric-blue shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-electric-blue flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Φάσεις Ανάπτυξης
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Πρόοδος: {completedCount}/{phases.length}</span>
              <Badge variant="outline" className="text-electric-blue">
                {Math.round(progressPercentage)}%
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {phases.map((phase) => (
                    <motion.div
                      key={phase.id}
                      layout
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {phase.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {phase.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`ml-2 text-xs ${getStatusColor(phase.status)}`}
                            >
                              {getStatusIcon(phase.status, currentPhase === phase.id)}
                              <span className="ml-1">
                                {phase.status === 'completed' ? 'Έτοιμο' : 
                                 phase.status === 'in-progress' ? 'Εκτέλεση' : 'Εκκρεμεί'}
                              </span>
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {phase.description}
                          </p>
                          
                          <Button
                            size="sm"
                            onClick={() => executePhase(phase.id)}
                            disabled={phase.status === 'in-progress' || currentPhase !== null}
                            className={`w-full text-xs h-7 ${
                              phase.status === 'completed' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-electric-blue hover:bg-electric-purple'
                            }`}
                          >
                            {phase.status === 'completed' ? 'Επανεκτέλεση' : 'Εκτέλεση Φάσης'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetProgress}
                    className="w-full text-xs"
                    disabled={currentPhase !== null}
                  >
                    Επαναφορά Προόδου
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default PhaseControlPanel;
