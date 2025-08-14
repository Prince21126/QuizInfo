'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { LearningResource, AnsweredQuestion } from '@/lib/types';
import { recommendLearningResources } from '@/ai/flows/recommend-learning-resources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, Repeat, Link as LinkIcon, Info, HelpCircle, X, Download, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Certificate from '@/components/certificate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getSkillInfo } from '@/lib/utils';


interface ResultsScreenProps {
  score: number;
  userName: string;
  domain: string;
  specialty?: string;
  totalQuestions: number;
  answeredQuestions: AnsweredQuestion[];
  onRestart: () => void;
}

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

function FailedQuestions({ questions }: { questions: AnsweredQuestion[] }) {
  const failed = questions.filter(q => !q.isCorrect);

  if (failed.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-primary" />
        Correction des erreurs
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {failed.map((q, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-3 text-left">
                <X className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="flex-1">{q.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pl-8">
              <p className="text-destructive text-base">
                <span className="font-semibold">Votre réponse :</span> {q.userAnswerIndex !== null ? q.options[q.userAnswerIndex] : "Pas de réponse (temps écoulé)"}
              </p>
              <p className="text-green-600 dark:text-green-400 text-base">
                <span className="font-semibold">Réponse correcte :</span> {q.options[q.correctAnswerIndex]}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}


export default function ResultsScreen({ score, userName, domain, specialty, totalQuestions, answeredQuestions, onRestart }: ResultsScreenProps) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const percentage = useMemo(() => Math.round((score / totalQuestions) * 100), [score, totalQuestions]);
  const { level, resultMessage, congratsMessage } = useMemo(() => getSkillInfo(percentage), [percentage]);
  
  const showCertificate = useMemo(() => percentage >= 80, [percentage]);

  const downloadCertificateAsPdf = async () => {
    const element = certificateRef.current;
    if (!element) return;
  
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
  
    pdf.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Certificat-${userName.replace(' ', '_')}.pdf`);
  };

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
          <CardTitle className="text-3xl md:text-4xl font-bold">{congratsMessage}</CardTitle>
          <CardDescription className="text-lg md:text-xl">Bravo, {userName} ! Voici vos résultats.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center items-baseline gap-4">
            <p className="text-6xl font-bold text-primary">{percentage}%</p>
            <p className="text-2xl text-muted-foreground">({score}/{totalQuestions})</p>
          </div>
          <div className="space-y-2">
            <Badge variant="outline" className="text-lg px-4 py-1 border-accent text-accent">{level}</Badge>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{resultMessage}</p>
          </div>
        </CardContent>
      </Card>

      {showCertificate && (
         <Card className="shadow-2xl">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-bold">Certificat de Réussite</CardTitle>
                <CardDescription>Vous avez démontré une connaissance de niveau {level}.</CardDescription>
            </CardHeader>
            <CardContent>
                <div ref={certificateRef}>
                    <Certificate userName={userName} domain={specialty || domain} level={level} date={new Date().toLocaleDateString('fr-FR')} />
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={downloadCertificateAsPdf} size="lg">
                    <Download className="mr-2 h-5 w-5"/>
                    Télécharger le certificat
                </Button>
            </CardFooter>
        </Card>
      )}

      <FailedQuestions questions={answeredQuestions} />
      
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
        {!loading && !error && resources.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Aucune ressource trouvée</AlertTitle>
            <AlertDescription>
              Nous n'avons pas pu trouver de ressources spécifiques pour cette combinaison de compétences. Essayez une autre évaluation pour de nouvelles recommandations !
            </AlertDescription>
          </Alert>
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
