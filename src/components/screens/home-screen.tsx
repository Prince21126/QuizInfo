'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOMAINS } from '@/lib/data';
import { History } from 'lucide-react';
import HistoryDrawer from '@/components/history-drawer';
import { useLanguage } from '@/components/language-provider';
import LanguageSwitcher from '@/components/language-switcher';

const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-14 w-14 text-primary"
    >
        <path d="M15.5 22a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-.5Z" />
        <path d="M12 17.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-.5Z" />
        <path d="M8.5 17.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-.5Z" />
        <path d="M12 13a3.5 3.5 0 0 0 3.5-3.5C15.5 7.5 12 2 12 2s-3.5 5.5-3.5 7.5A3.5 3.5 0 0 0 12 13Z" />
        <path d="M19.5 12.5c0-3.5-4-8-7.5-8s-7.5 4.5-7.5 8" />
        <path d="M19.5 13c0 1-1 2-2 2h-11c-1 0-2-1-2-2" />
    </svg>
)

interface HomeScreenProps {
  onStartQuiz: (firstName: string, lastName: string, domain: string, specialty?: string) => void;
}

export default function HomeScreen({ onStartQuiz }: HomeScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [domain, setDomain] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const { language, t } = useLanguage();

  const domains = useMemo(() => DOMAINS(language), [language]);
  const selectedDomain = useMemo(() => domains.find(d => d.value === domain), [domain, domains]);
  const hasSpecialties = selectedDomain && selectedDomain.specialties && selectedDomain.specialties.length > 0;

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setSpecialty('');
  };

  const canStart = firstName.trim() !== '' && lastName.trim() !== '' && domain !== '' && (!hasSpecialties || specialty !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStart) {
      onStartQuiz(firstName, lastName, domain, hasSpecialties ? specialty : undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
       <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} />
      <Card className="w-full max-w-lg shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
             <div className="absolute top-4 left-4">
                <LanguageSwitcher />
            </div>
             <div className="flex items-center justify-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                    <Logo />
                </div>
                <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
                    onClick={() => setHistoryOpen(true)}
                >
                    <History className="h-6 w-6" />
                    <span className="sr-only">{t.home.historyButton}</span>
                </Button>
            </div>
            <CardTitle className="text-3xl font-bold">{t.home.title}</CardTitle>
            <CardDescription className="text-lg">{t.home.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base">{t.home.firstNameLabel}</Label>
                <Input 
                  id="firstName" 
                  placeholder={t.home.firstNamePlaceholder} 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base">{t.home.lastNameLabel}</Label>
                <Input 
                  id="lastName" 
                  placeholder={t.home.lastNamePlaceholder} 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
                  className="text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-base">{t.home.domainLabel}</Label>
              <Select value={domain} onValueChange={handleDomainChange}>
                <SelectTrigger id="domain" className="text-base">
                  <SelectValue placeholder={t.home.domainPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {domains.map(d => (
                    <SelectItem key={d.value} value={d.value} className="text-base">{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasSpecialties && (
              <div className="space-y-2 animate-in fade-in duration-500">
                <Label htmlFor="specialty" className="text-base">{t.home.specialtyLabel}</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger id="specialty" className="text-base">
                    <SelectValue placeholder={t.home.specialtyPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDomain.specialties!.map(s => (
                      <SelectItem key={s.value} value={s.value} className="text-base">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!canStart} className="w-full text-lg py-6">
              {t.home.startButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
