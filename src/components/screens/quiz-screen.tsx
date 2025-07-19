'use client';

import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number) => void;
}

export default function QuizScreen({ questions, onQuizComplete }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    let newScore = score;
    if (answerIndex === currentQuestion.correctAnswerIndex) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        onQuizComplete(newScore);
      }
      setIsTransitioning(false);
    }, 1500);
  };
  
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const getOptionStyle = (optionIndex: number) => {
    if (!isAnswered) {
      return 'border-border hover:border-primary hover:bg-primary/5';
    }
    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    const isSelected = optionIndex === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 transform scale-105';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300';
    }
    return 'border-border opacity-60';
  };
  
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex justify-between items-center gap-4 mb-4">
          <CardTitle className="text-xl md:text-2xl">Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
        </div>
        <Progress value={progressValue} className="w-full" />
      </CardHeader>
      <CardContent className="px-6 py-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 min-h-[100px]">{currentQuestion.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => handleAnswer(index)}
              className={cn(
                'flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all duration-300 w-full disabled:cursor-not-allowed',
                getOptionStyle(index)
              )}
            >
              <span className="text-lg font-medium">{option}</span>
              {isAnswered && selectedAnswer === index && (
                <div className="animate-in zoom-in-50 duration-500">
                  {index === currentQuestion.correctAnswerIndex ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-8 text-center h-10">
          {isTransitioning && currentQuestionIndex < questions.length - 1 && (
             <div className="flex justify-center items-center gap-2 text-muted-foreground animate-in fade-in">
              <p>Prochaine question...</p>
              <Loader2 className="h-4 w-4 animate-spin"/>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
