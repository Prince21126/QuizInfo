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
  prompt: `Vous êtes un professeur spécialisé dans la création de quiz pour évaluer les connaissances en informatique.

  Générez un quiz de 20 questions à choix multiples (QCM) en français, basé sur le domaine suivant : {{domain}}.
  {{#if specialty}}
  La spécialité est : {{specialty}}.
  {{/if}}

  Chaque question doit avoir 4 options de réponse, et une seule doit être correcte.
  Les questions doivent couvrir différents niveaux de difficulté (débutant à avancé) pour évaluer précisément le niveau de l'utilisateur.

  Le format de sortie doit être un tableau JSON de 20 objets, où chaque objet représente une question et a la structure suivante:
  {
    "question": "La question du quiz en français",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswerIndex": l'index (0-3) de la réponse correcte dans le tableau options
  }

  Assurez-vous que les questions sont pertinentes et testent la compréhension conceptuelle et pratique.
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
