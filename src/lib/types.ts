import type { GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import type { RecommendLearningResourcesOutput } from "@/ai/flows/recommend-learning-resources";

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

export type SkillLevel = 'Débutant / Amateur' | 'Intermédiaire' | 'Confirmé / Avancé' | 'Expert';
