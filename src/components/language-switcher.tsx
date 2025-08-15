// src/components/language-switcher.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <Button 
      variant="ghost" 
      onClick={toggleLanguage}
      className="text-muted-foreground hover:text-primary flex items-center gap-2 px-3"
      aria-label={language === 'fr' ? "Switch to English" : "Changer en Français"}
    >
      <Languages className="h-5 w-5" />
      <span className="font-semibold uppercase">{language === 'fr' ? 'EN' : 'FR'}</span>
    </Button>
  );
}
