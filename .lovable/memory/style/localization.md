---
name: localization
description: 11 supported languages (EN, DE, FR, ES, IT, BG, RO, TR, AR-RTL, ZH, RU) via i18next
type: feature
---
i18next + react-i18next + i18next-browser-languagedetector.
Config: src/i18n/config.ts. Locales: src/i18n/locales/{code}.json.
Switcher: src/components/LanguageSwitcher.tsx (mounted in Navbar).
Auto-translate edge function: supabase/functions/translate-ui (Gemini 2.5 Flash Lite).
AR is RTL — applied automatically via i18n.on('languageChanged').
Storage key: novacoin_lang.
