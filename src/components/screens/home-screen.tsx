'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOMAINS } from '@/lib/data';
import { BookMarked, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HomeScreenProps {
  onStartQuiz: (userName: string, domain: string, specialty?: string) => void;
}

const apiKeyMissing = !process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function HomeScreen({ onStartQuiz }: HomeScreenProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [specialty, setSpecialty] = useState('');

  const selectedDomain = useMemo(() => DOMAINS.find(d => d.value === domain), [domain]);
  const hasSpecialties = selectedDomain && selectedDomain.specialties && selectedDomain.specialties.length > 0;

  const canStart = name.trim() !== '' && domain !== '' && (!hasSpecialties || specialty !== '') && !apiKeyMissing;

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
            {apiKeyMissing && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration requise</AlertTitle>
                <AlertDescription>
                  La clé API Gemini est manquante. Veuillez l'ajouter à votre fichier <code>.env</code> sous le nom <code>NEXT_PUBLIC_GEMINI_API_KEY</code> pour continuer.
                </AlertDescription>
              </Alert>
            )}
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
              <Select value={domain} onValuechange={value => { setDomain(value); setSpecialty(''); }}>
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
