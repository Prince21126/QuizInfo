'use client';

import React, { useState, useCallback } from 'react';
import type { QuizQuestion, AnsweredQuestion } from '@/lib/types';
import HomeScreen from '@/components/screens/home-screen';
import QuizScreen from '@/components/screens/quiz-screen';
import ResultsScreen from '@/components/screens/results-screen';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { useQuizHistory } from '@/hooks/use-quiz-history';
import { getSkillInfo } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';

type AppScreen = 'home' | 'quiz' | 'results';
type QuizState = {
  questions: QuizQuestion[];
  answeredQuestions: AnsweredQuestion[];
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
  const { addHistoryEntry } = useQuizHistory();
  const { language, t } = useLanguage();

  const handleStartQuiz = useCallback(async (firstName: string, lastName: string, domain: string, specialty?: string) => {
    setLoading(true);
    const userName = `${firstName} ${lastName}`;
    try {
      const questions = await generateQuizQuestions({ domain, specialty, language });
      if (questions && questions.length > 0) {
        setQuizState({ userName, domain, specialty, questions, answeredQuestions: [], score: 0 });
        setScreen('quiz');
      } else {
        throw new Error(t.quizApp.generateError);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t.toast.errorTitle,
        description: t.quizApp.generateError,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, language, t]);

  const handleQuizComplete = useCallback((answeredQuestions: AnsweredQuestion[]) => {
    const score = answeredQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = quizState.questions!.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const { level } = getSkillInfo(percentage, language);

    const newQuizState = { ...quizState, answeredQuestions, score };
    setQuizState(newQuizState);
    
    addHistoryEntry({
      id: new Date().toISOString(),
      userName: newQuizState.userName!,
      domain: newQuizState.domain!,
      specialty: newQuizState.specialty,
      score,
      totalQuestions,
      level,
      date: new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')
    });

    setScreen('results');
  }, [quizState, addHistoryEntry, language]);

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
            answeredQuestions={quizState.answeredQuestions!}
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
             <p className="text-lg font-medium text-foreground">{t.quizApp.loadingTitle}</p>
             <p className="text-muted-foreground">{t.quizApp.loadingDescription}</p>
          </div>
        ) : (
          renderScreen()
        )}
      </div>
    </main>
  );
}
