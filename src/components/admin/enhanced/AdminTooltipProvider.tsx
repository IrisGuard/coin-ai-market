
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TooltipContextType {
  showTooltips: boolean;
  toggleTooltips: () => void;
}

const TooltipContext = createContext<TooltipContextType>({
  showTooltips: true,
  toggleTooltips: () => {}
});

export const useAdminTooltips = () => useContext(TooltipContext);

interface AdminTooltipProviderProps {
  children: ReactNode;
}

export const AdminTooltipProvider: React.FC<AdminTooltipProviderProps> = ({ children }) => {
  const [showTooltips, setShowTooltips] = useState(true);

  const toggleTooltips = () => setShowTooltips(!showTooltips);

  return (
    <TooltipContext.Provider value={{ showTooltips, toggleTooltips }}>
      <TooltipProvider delayDuration={300}>
        {children}
      </TooltipProvider>
    </TooltipContext.Provider>
  );
};

interface AdminTooltipProps {
  content: string;
  shortcut?: string;
  children: ReactNode;
}

export const AdminTooltip: React.FC<AdminTooltipProps> = ({ content, shortcut, children }) => {
  const { showTooltips } = useAdminTooltips();

  if (!showTooltips) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p>{content}</p>
          {shortcut && (
            <div className="text-xs text-muted-foreground">
              Shortcut: <kbd className="px-1 py-0.5 bg-muted rounded text-xs">{shortcut}</kbd>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
