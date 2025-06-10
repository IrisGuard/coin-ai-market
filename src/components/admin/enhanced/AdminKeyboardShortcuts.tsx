
import React, { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

interface AdminKeyboardShortcutsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onSearch?: () => void;
}

const AdminKeyboardShortcuts: React.FC<AdminKeyboardShortcutsProps> = ({
  currentTab,
  onTabChange,
  onExport,
  onRefresh,
  onSearch
}) => {
  const shortcuts: ShortcutAction[] = [
    {
      key: '1',
      ctrl: true,
      action: () => onTabChange('system'),
      description: 'Navigate to System tab'
    },
    {
      key: '2',
      ctrl: true,
      action: () => onTabChange('users'),
      description: 'Navigate to Users tab'
    },
    {
      key: '3',
      ctrl: true,
      action: () => onTabChange('ai-brain'),
      description: 'Navigate to AI Brain tab'
    },
    {
      key: '4',
      ctrl: true,
      action: () => onTabChange('api-keys'),
      description: 'Navigate to API Keys tab'
    },
    {
      key: '5',
      ctrl: true,
      action: () => onTabChange('data-sources'),
      description: 'Navigate to Data Sources tab'
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      action: () => onExport?.(),
      description: 'Export current data'
    },
    {
      key: 'r',
      ctrl: true,
      shift: true,
      action: () => onRefresh?.(),
      description: 'Refresh current view'
    },
    {
      key: 'k',
      ctrl: true,
      action: () => onSearch?.(),
      description: 'Open search'
    },
    {
      key: '?',
      ctrl: true,
      action: () => showShortcutHelp(),
      description: 'Show keyboard shortcuts'
    }
  ];

  const showShortcutHelp = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: (
        <div className="space-y-2 text-sm">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between">
              <span>{shortcut.description}</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                {shortcut.ctrl && 'Ctrl+'}
                {shortcut.alt && 'Alt+'}
                {shortcut.shift && 'Shift+'}
                {shortcut.key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>
      ),
      duration: 8000
    });
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrl &&
        !!event.altKey === !!shortcut.alt &&
        !!event.shiftKey === !!shortcut.shift
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null; // This component only handles keyboard events
};

export default AdminKeyboardShortcuts;
