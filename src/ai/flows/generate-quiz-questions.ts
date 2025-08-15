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
  domain: z.string().describe('The main domain of the quiz (e.g., Software Development, Cybersecurity).'),
  specialty: z.string().optional().describe('The specific area within the domain (e.g., Web Frontend, Mobile).'),
  language: z.enum(['fr', 'en']).describe('The language for the quiz (fr for French, en for English).'),
});

export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question in the specified language.'),
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
  prompt: `You are an expert system responsible for generating rigorous technical assessments.

  The user's requested language is: {{language}}. ALL content you generate must be in this language.
  
  Generate a quiz of 20 multiple-choice questions (MCQ) for the domain: {{domain}}.
  {{#if specialty}}
  The specialty is: {{specialty}}.
  {{/if}}

  STRICT REQUIREMENTS:
  1.  **High and Progressive Difficulty**: The first 10 questions should be of intermediate level. The last 10 questions (11 to 20) must be particularly complex, aimed at experts and covering advanced concepts, non-trivial use cases, or advanced issues.
  2.  **Precision and Concision**: Each question must be formulated clearly, concisely, and without any ambiguity.
  3.  **STRICT NON-REPETITION**: NEVER repeat questions. Each quiz generation for the same domain must produce an entirely new and original set of questions. This is a mandatory rule.
  4.  **Credible Options**: Incorrect answer options must be plausible and relevant to test deep understanding, not just term recognition.
  5.  **Language**: All content must be exclusively in the requested language ({{language}}).

  The output format must be a JSON array of 20 objects, where each object represents a question and follows the defined structure.
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
