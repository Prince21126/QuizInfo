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
    .min(3)
    .max(5)
    .describe('A list of 3 to 5 recommended learning resources in French.'),
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
  prompt: `Vous êtes un assistant IA expert en recommandation de ressources pédagogiques en français.

  En vous basant sur le domaine, la spécialité (si fournie) et le niveau de l'utilisateur, recommandez 3 à 5 ressources pertinentes (livres, tutoriels, sites web) qui sont gratuites.

  IMPORTANT : Pour les URLs, fournissez des liens stables et de haut niveau. Par exemple, au lieu d'un lien profond vers un article spécifique, préférez un lien vers la page principale d'un tutoriel ou la page d'accueil d'un site. Pour un livre, un lien vers sa page sur une librairie en ligne connue est préférable à un lien de téléchargement direct qui risque d'être invalide.

  Les ressources doivent être adaptées au niveau de l'utilisateur.

  Domaine : {{{domain}}}
  {{#if specialty}}
  Spécialité : {{{specialty}}}
  {{/if}}
  Niveau de compétence : {{{skillLevel}}}

  Assurez-vous que toutes les ressources sont en français.

  Formatez votre réponse en tant qu'objet JSON conforme au schéma. Chaque ressource doit inclure un titre, une courte description et une URL valide.
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
