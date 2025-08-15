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
      size="icon" 
      onClick={toggleLanguage}
      className="text-muted-foreground hover:text-primary"
      aria-label="Changer de langue"
    >
      <Languages className="h-6 w-6" />
      <span className="ml-2 font-semibold uppercase">{language === 'fr' ? 'EN' : 'FR'}</span>
    </Button>
  );
}
