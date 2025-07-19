'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOMAINS } from '@/lib/data';
import { BookMarked } from 'lucide-react';

interface HomeScreenProps {
  onStartQuiz: (userName: string, domain: string, specialty?: string) => void;
}

export default function HomeScreen({ onStartQuiz }: HomeScreenProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [specialty, setSpecialty] = useState('');

  const selectedDomain = useMemo(() => DOMAINS.find(d => d.value === domain), [domain]);
  const hasSpecialties = selectedDomain && selectedDomain.specialties && selectedDomain.specialties.length > 0;

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setSpecialty('');
  };

  const canStart = name.trim() !== '' && domain !== '' && (!hasSpecialties || specialty !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStart) {
      onStartQuiz(name, domain, hasSpecialties ? specialty : undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
              <BookMarked className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Informatique</CardTitle>
            <CardDescription className="text-lg">Évaluez vos connaissances et progressez !</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Votre nom</Label>
              <Input 
                id="name" 
                placeholder="Ex: Jean Dupont" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-base">Choisissez un domaine</Label>
              <Select value={domain} onValueChange={handleDomainChange}>
                <SelectTrigger id="domain" className="text-base">
                  <SelectValue placeholder="Sélectionnez un domaine..." />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map(d => (
                    <SelectItem key={d.value} value={d.value} className="text-base">{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasSpecialties && (
              <div className="space-y-2 animate-in fade-in duration-500">
                <Label htmlFor="specialty" className="text-base">Choisissez une spécialité</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger id="specialty" className="text-base">
                    <SelectValue placeholder="Sélectionnez une spécialité..." />
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
              Commencer l'évaluation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
