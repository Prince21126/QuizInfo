import type { GenerateQuizQuestionsOutput, RecommendLearningResourcesOutput } from "@/ai/flows";

export type QuizQuestion = GenerateQuizQuestionsOutput[0];
export type LearningResource = RecommendLearningResourcesOutput['resources'][0];

export type Domain = {
  value: string;
  label: string;
  specialties?: {
    value: string;
    label:string;
  }[];
};

export type AppScreen = 'home' | 'quiz' | 'results';

export type SkillLevel = 'Expert' | 'Confirmé / Avancé' | 'Intermédiaire' | 'Débutant / Amateur' | 'Advanced' | 'Intermediate' | 'Beginner';

export type AnsweredQuestion = QuizQuestion & {
  userAnswerIndex: number | null;
  isCorrect: boolean;
};

export type QuizHistoryEntry = {
    id: string;
    userName: string;
    domain: string;
    specialty?: string;
    score: number;
    totalQuestions: number;
    level: SkillLevel;
    date: string;
};
