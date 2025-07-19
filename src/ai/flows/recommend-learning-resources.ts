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
  domain: z.string().describe('The chosen domain of the quiz (e.g., Développement Logiciel).'),
  specialty: z
    .string()
    .optional()
    .describe('The chosen specialty within the domain (e.g., Web Frontend).'),
  skillLevel: z
    .string()
    .describe(
      'The skill level of the user, as determined by their quiz score (e.g., Débutant, Intermédiaire, Avancé, Expert).'
    ),
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
    .describe('A list of recommended learning resources in French.'),
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
  prompt: `You are an AI assistant designed to recommend learning resources in French.

  Based on the user's chosen domain, specialty (if applicable), and skill level, recommend 3-5 relevant learning resources (books, tutorials, websites) that are freely available.

  The resources should be tailored to the user's level, ensuring they are appropriate for their current knowledge and skill set.

  Domain: {{{domain}}}
  Specialty: {{{specialty}}}
  Skill Level: {{{skillLevel}}}

  Ensure that all resources are in French.

  Format your response as a JSON object conforming to the schema. Each resource should include a title, a short description, and a URL.
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
