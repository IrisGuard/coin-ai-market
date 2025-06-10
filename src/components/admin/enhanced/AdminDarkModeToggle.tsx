
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const AdminDarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Dark
        </>
      )}
    </Button>
  );
};

export default AdminDarkModeToggle;
