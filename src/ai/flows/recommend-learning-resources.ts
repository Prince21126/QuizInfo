// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A flow to recommend learning resources based on the user's skill level and chosen domain.
 *
 * - recommendLearningResources - A function that handles the recommendation process.
 * - RecommendLearningResourcesInput - The input type for the recommendLearningResources function.
 * - RecommendLearningResourcesOutput - The return type for the recommendLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLearningResourcesInputSchema = z.object({
  domain: z.string().describe('The chosen domain of the quiz (e.g., Software Development).'),
  specialty: z
    .string()
    .optional()
    .describe('The chosen specialty within the domain (e.g., Web Frontend).'),
  skillLevel: z
    .string()
    .describe(
      "The skill level of the user, as determined by their quiz score (e.g., Beginner, Intermediate, Advanced, Expert)."
    ),
  language: z.enum(['fr', 'en']).describe('The language for the recommendations (fr for French, en for English).'),
});
export type RecommendLearningResourcesInput = z.infer<typeof RecommendLearningResourcesInputSchema>;

const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the learning resource.'),
  description: z.string().describe('A short description of the learning resource.'),
  url: z.string().describe('The URL where the learning resource can be accessed.'),
});

const RecommendLearningResourcesOutputSchema = z.object({
  resources: z
    .array(LearningResourceSchema)
    .min(3)
    .max(5)
    .describe('A list of 3 to 5 recommended learning resources in the specified language.'),
});
export type RecommendLearningResourcesOutput = z.infer<typeof RecommendLearningResourcesOutputSchema>;

export async function recommendLearningResources(
  input: RecommendLearningResourcesInput
): Promise<RecommendLearningResourcesOutput> {
  return recommendLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLearningResourcesPrompt',
  input: {schema: RecommendLearningResourcesInputSchema},
  output: {schema: RecommendLearningResourcesOutputSchema},
  prompt: `You are an AI assistant expert in recommending educational resources. Your response must be in the language: {{{language}}}.

  Based on the domain, specialty (if provided), and user's skill level, recommend 3 to 5 relevant resources (books, tutorials, websites) that are free.

  IMPORTANT: For URLs, provide stable, high-level links. For example, instead of a deep link to a specific article, prefer a link to a tutorial's main page or a website's homepage. For a book, a link to its page on a well-known online bookstore is better than a direct download link that might become invalid.

  The resources must be adapted to the user's skill level and be in the specified language.

  Domain: {{{domain}}}
  {{#if specialty}}
  Specialty: {{{specialty}}}
  {{/if}}
  Skill Level: {{{skillLevel}}}
  Language: {{{language}}}

  Format your response as a JSON object conforming to the schema. Each resource must include a title, a short description, and a valid URL.
  `,
});

const recommendLearningResourcesFlow = ai.defineFlow(
  {
    name: 'recommendLearningResourcesFlow',
    inputSchema: RecommendLearningResourcesInputSchema,
    outputSchema: RecommendLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
