// src/ai/flows/generate-quiz-questions.ts
'use server';

/**
 * @fileOverview Generates a quiz of 20 multiple-choice questions in French based on the selected domain and specialty.
 *
 * - generateQuizQuestions - A function that generates the quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  domain: z.string().describe('The main domain of the quiz (e.g., Développement Logiciel, Cybersécurité).'),
  specialty: z.string().optional().describe('The specific area within the domain (e.g., Web Frontend, Mobile).'),
});

export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question in French.'),
  options: z.array(z.string()).length(4).describe('Four possible answers to the question, one of which is correct.'),
  correctAnswerIndex: z.number().int().min(0).max(3).describe('The index (0-3) of the correct answer in the options array.'),
});

const GenerateQuizQuestionsOutputSchema = z.array(QuizQuestionSchema).length(20).describe('An array of 20 quiz questions.');

export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {
    schema: GenerateQuizQuestionsInputSchema,
  },
  output: {
    schema: GenerateQuizQuestionsOutputSchema,
  },
  prompt: `Vous êtes un système expert chargé de générer des évaluations techniques rigoureuses en français.

  Générez un quiz de 20 questions à choix multiples (QCM) en français pour le domaine : {{domain}}.
  {{#if specialty}}
  La spécialité est : {{specialty}}.
  {{/if}}

  EXIGENCES STRICTES :
  1.  **Difficulté Élevée et Progressive** : Les 10 premières questions doivent être de niveau intermédiaire. Les 10 dernières questions (11 à 20) doivent être particulièrement complexes, destinées à des experts et portant sur des concepts pointus, des cas d'usage non triviaux ou des problématiques avancées.
  2.  **Précision et Concision** : Chaque question doit être formulée de manière claire, concise, et sans aucune ambiguïté.
  3.  **NON-RÉPÉTITION STRICTE** : Ne répétez JAMAIS les questions. Chaque génération de quiz pour un même domaine doit produire un ensemble de questions entièrement nouveau et original. C'est une règle impérative.
  4.  **Options Crédibles** : Les options de réponse incorrectes doivent être plausibles et pertinentes pour tester une compréhension approfondie, et non une simple reconnaissance de termes.
  5.  **Langage** : Le langage doit être exclusivement le français.

  Le format de sortie doit être un tableau JSON de 20 objets, où chaque objet représente une question et respecte la structure définie.
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
