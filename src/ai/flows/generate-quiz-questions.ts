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
  prompt: `Vous êtes un professeur expert et exigeant, spécialisé dans la création de quiz informatiques en français.

  Générez un quiz de 20 questions à choix multiples (QCM) en français, basé sur le domaine suivant : {{domain}}.
  {{#if specialty}}
  La spécialité est : {{specialty}}.
  {{/if}}

  CRITÈRES IMPORTANTS :
  1.  **Difficulté Progressive** : Les 10 premières questions doivent couvrir les niveaux débutant et intermédiaire. Les 10 dernières questions (11 à 20) doivent être complexes et destinées à des utilisateurs avancés et experts, testant des concepts pointus et des cas d'usage spécifiques.
  2.  **Pertinence et Précision** : Chaque question doit être pertinente, précise et sans ambiguïté.
  3.  **Originalité** : Évitez les questions trop communes ou triviales. Proposez des questions qui suscitent la réflexion. Ne jamais répéter les mêmes questions si l'on vous le demande à nouveau pour le même domaine.
  4.  **Options Crédibles** : Les options incorrectes (distracteurs) doivent être plausibles et bien conçues pour tester une véritable compréhension, et non une simple mémorisation.

  Chaque question doit avoir 4 options de réponse, et une seule doit être correcte.

  Le format de sortie doit être un tableau JSON de 20 objets, où chaque objet représente une question et a la structure suivante:
  {
    "question": "La question du quiz en français",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswerIndex": l'index (0-3) de la réponse correcte dans le tableau options
  }
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
