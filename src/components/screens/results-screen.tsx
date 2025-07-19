'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { LearningResource } from '@/lib/types';
import { recommendLearningResources } from '@/ai/flows/recommend-learning-resources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, Repeat, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ResultsScreenProps {
  score: number;
  userName: string;
  domain: string;
  specialty?: string;
  totalQuestions: number;
  onRestart: () => void;
}

const getSkillLevel = (percentage: number): { level: 'Expert' | 'Confirmé / Avancé' | 'Intermédiaire' | 'Débutant / Amateur', message: string } => {
  if (percentage >= 90) return { level: 'Expert', message: "Félicitations ! Votre expertise est impressionnante. Continuez à explorer les sujets avancés." };
  if (percentage >= 75) return { level: 'Confirmé / Avancé', message: "Excellent travail ! Vous maîtrisez bien le sujet. Approfondissez vos connaissances pour devenir un expert." };
  if (percentage >= 50) return { level: 'Intermédiaire', message: "Vous avez de solides connaissances ! Continuez sur cette lancée pour consolider vos acquis." };
  return { level: 'Débutant / Amateur', message: "C'est un bon début ! Les ressources ci-dessous vous aideront à construire une base solide." };
};

function ResourceSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-28" />
            </CardFooter>
        </Card>
    )
}

export default function ResultsScreen({ score, userName, domain, specialty, totalQuestions, onRestart }: ResultsScreenProps) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const percentage = useMemo(() => Math.round((score / totalQuestions) * 100), [score, totalQuestions]);
  const { level, message } = useMemo(() => getSkillLevel(percentage), [percentage]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await recommendLearningResources({
          domain,
          specialty,
          skillLevel: level,
        });
        setResources(result.resources);
      } catch (e) {
        console.error("Failed to fetch resources:", e);
        setError("Impossible de charger les ressources recommandées. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [domain, specialty, level]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Card className="text-center shadow-2xl">
        <CardHeader>
           <div className="mx-auto bg-accent/10 p-4 rounded-full mb-4 w-fit">
              <Award className="h-10 w-10 text-accent" />
            </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">Bravo, {userName} !</CardTitle>
          <CardDescription className="text-lg md:text-xl">Voici vos résultats.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center items-baseline gap-4">
            <p className="text-6xl font-bold text-primary">{percentage}%</p>
            <p className="text-2xl text-muted-foreground">({score}/{totalQuestions})</p>
          </div>
          <div className="space-y-2">
            <Badge variant="outline" className="text-lg px-4 py-1 border-accent text-accent">{level}</Badge>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{message}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary"/>
            Ressources pour progresser
        </h2>
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <ResourceSkeleton key={i} />)}
          </div>
        )}
        {error && (
             <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!loading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <Card key={res.url} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{res.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{res.description}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline">
                        <Link href={res.url} target="_blank" rel="noopener noreferrer">
                            Consulter <LinkIcon className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Button size="lg" onClick={onRestart} className="text-lg py-7 px-8">
          <Repeat className="mr-2 h-5 w-5" />
          Faire une nouvelle évaluation
        </Button>
      </div>
    </div>
  );
}
