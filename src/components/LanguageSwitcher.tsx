import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ??
    SUPPORTED_LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ??
    SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 rounded-lg hover:bg-secondary"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono font-semibold tracking-wider">{current.country}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-80 overflow-y-auto w-64 glass-panel-strong border-border"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer focus:bg-secondary"
          >
            <span className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-muted-foreground w-7">
                {lang.country}
              </span>
              <span className="text-sm">{lang.label}</span>
            </span>
            {current.code === lang.code && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
