'use client';

import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '@/lib/types';
import HomeScreen from '@/components/screens/home-screen';
import QuizScreen from '@/components/screens/quiz-screen';
import ResultsScreen from '@/components/screens/results-screen';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

type AppScreen = 'home' | 'quiz' | 'results';
type QuizState = {
  questions: QuizQuestion[];
  domain: string;
  specialty?: string;
  userName: string;
  score: number;
};

export function QuizApp() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<Partial<QuizState>>({});
  const { toast } = useToast();

  const handleStartQuiz = useCallback(async (userName: string, domain: string, specialty?: string) => {
    setLoading(true);
    try {
      const questions = await generateQuizQuestions({ domain, specialty });
      if (questions && questions.length > 0) {
        setQuizState({ userName, domain, specialty, questions, score: 0 });
        setScreen('quiz');
      } else {
        throw new Error("Le quiz n'a pas pu être généré.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le quiz. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleQuizComplete = useCallback((score: number) => {
    setQuizState(prev => ({ ...prev, score }));
    setScreen('results');
  }, []);

  const handleRestart = useCallback(() => {
    setQuizState({});
    setScreen('home');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'quiz':
        return (
          <QuizScreen
            questions={quizState.questions!}
            onQuizComplete={handleQuizComplete}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            score={quizState.score!}
            userName={quizState.userName!}
            domain={quizState.domain!}
            specialty={quizState.specialty}
            totalQuestions={quizState.questions!.length}
            onRestart={handleRestart}
          />
        );
      case 'home':
      default:
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <p className="text-lg font-medium text-foreground">Génération du quiz en cours...</p>
             <p className="text-muted-foreground">Cela peut prendre quelques instants.</p>
          </div>
        ) : (
          renderScreen()
        )}
      </div>
    </main>
  );
}
