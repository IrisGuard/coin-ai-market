
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface VoiceCommand {
  pattern: RegExp;
  action: (match: RegExpMatchArray) => void;
  description: string;
}

export const useVoiceCommands = () => {
  const navigate = useNavigate();

  const executeSearch = useCallback((searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    toast({
      title: "Αναζήτηση",
      description: `Αναζήτηση για: ${searchTerm}`,
    });
  }, [navigate]);

  const voiceCommands: VoiceCommand[] = [
    // Greek commands
    {
      pattern: /αναζήτηση (.+)/i,
      action: (match) => executeSearch(match[1]),
      description: "Αναζήτηση [όρος] - Αναζητά νομίσματα"
    },
    {
      pattern: /πήγαινε marketplace|πήγαινε στο marketplace/i,
      action: () => {
        navigate('/marketplace');
        toast({ title: "Πλοήγηση", description: "Μετάβαση στο Marketplace" });
      },
      description: "Πήγαινε marketplace - Μετάβαση στην αγορά"
    },
    {
      pattern: /άνοιξε admin|admin panel/i,
      action: () => {
        navigate('/admin');
        toast({ title: "Πλοήγηση", description: "Άνοιγμα Admin Panel" });
      },
      description: "Άνοιξε admin - Άνοιγμα διαχείρισης"
    },
    {
      pattern: /πήγαινε αρχική|πήγαινε στην αρχική/i,
      action: () => {
        navigate('/');
        toast({ title: "Πλοήγηση", description: "Μετάβαση στην αρχική" });
      },
      description: "Πήγαινε αρχική - Μετάβαση στην αρχική σελίδα"
    },
    // English commands
    {
      pattern: /search (.+)/i,
      action: (match) => executeSearch(match[1]),
      description: "Search [term] - Search for coins"
    },
    {
      pattern: /go to marketplace|navigate to marketplace/i,
      action: () => {
        navigate('/marketplace');
        toast({ title: "Navigation", description: "Going to Marketplace" });
      },
      description: "Go to marketplace - Navigate to the marketplace"
    },
    {
      pattern: /open admin|admin panel/i,
      action: () => {
        navigate('/admin');
        toast({ title: "Navigation", description: "Opening Admin Panel" });
      },
      description: "Open admin - Open admin panel"
    },
    {
      pattern: /go home|go to home/i,
      action: () => {
        navigate('/');
        toast({ title: "Navigation", description: "Going home" });
      },
      description: "Go home - Navigate to home page"
    },
    // Help commands
    {
      pattern: /βοήθεια|help|εντολές|commands/i,
      action: () => {
        const commandsList = voiceCommands
          .filter(cmd => cmd.description)
          .map(cmd => cmd.description)
          .join('\n');
        
        toast({
          title: "Διαθέσιμες εντολές / Available Commands",
          description: commandsList,
        });
      },
      description: "Βοήθεια/Help - Εμφάνιση διαθέσιμων εντολών"
    }
  ];

  const processCommand = useCallback((transcript: string) => {
    const command = transcript.trim();
    console.log('Processing voice command:', command);

    for (const voiceCommand of voiceCommands) {
      const match = command.match(voiceCommand.pattern);
      if (match) {
        console.log('Matched command:', voiceCommand.description);
        voiceCommand.action(match);
        return true;
      }
    }

    toast({
      title: "Άγνωστη εντολή",
      description: `Δεν κατάλαβα την εντολή: "${command}". Πες "βοήθεια" για διαθέσιμες εντολές.`,
      variant: "destructive"
    });
    return false;
  }, [navigate]);

  return {
    processCommand,
    availableCommands: voiceCommands.map(cmd => cmd.description)
  };
};
