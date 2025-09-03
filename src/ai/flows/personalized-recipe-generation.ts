'use server';

/**
 * @fileOverview Personalized recipe generation flow.
 *
 * This file defines a Genkit flow that takes a list of available ingredients as input
 * and generates personalized, healthy, weight-loss-oriented recipes using a Large Language Model.
 *
 * @fileOverview Personalized recipe generation flow.
 * @param {PersonalizedRecipeInput} input - The input for the personalized recipe generation flow.
 * @returns {Promise<PersonalizedRecipeOutput>} - A promise that resolves to the generated recipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const PersonalizedRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe("A comma separated list of ingredients that the user has available."),
  dietaryNeeds: z
    .string()
    .optional()
    .describe("Any specific dietary needs or restrictions the user has, e.g., 'vegetarian', 'gluten-free', 'low-carb'."),
});
export type PersonalizedRecipeInput = z.infer<typeof PersonalizedRecipeInputSchema>;

const PersonalizedRecipeOutputSchema = z.object({
  recipeName: z.string().describe("The name of the generated recipe in Arabic."),
  ingredients: z.string().describe("A list of ingredients required for the recipe in Arabic."),
  instructions: z.string().describe("Step-by-step instructions for preparing the recipe in Arabic."),
  calories: z.string().describe("The estimated calorie count for the recipe."),
});
export type PersonalizedRecipeOutput = z.infer<typeof PersonalizedRecipeOutputSchema>;

export async function generatePersonalizedRecipe(input: PersonalizedRecipeInput): Promise<PersonalizedRecipeOutput> {
  return personalizedRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecipePrompt',
  input: {schema: PersonalizedRecipeInputSchema},
  output: {schema: PersonalizedRecipeOutputSchema},
  prompt: `You are a personal chef creating a personalized recipe in Arabic based on the available ingredients, and dietary restrictions.

  Available Ingredients: {{{ingredients}}}
  Dietary Restrictions: {{#if dietaryNeeds}}{{{dietaryNeeds}}}{{else}}None{{/if}}

  Create a recipe that is healthy, delicious, and suitable for weight loss. The response must be in Arabic.

  Ensure the recipe includes:
  * A creative name for the recipe in Arabic.
  * A list of ingredients with quantities in Arabic.
  * Step-by-step preparation instructions in Arabic.
  * An estimated calorie count for the entire recipe.

  Format the response in a JSON format that can be parsed by Typescript, including descriptions from the output schema.  Do not include any conversational text before or after the JSON.
  Follow the schema exactly.  The descriptions are there to guide you, not to be directly included in the output.
  Ensure quantities are included with ingredients and the calorie count is estimated, rather than exact.
`,
});

const personalizedRecipeFlow = ai.defineFlow(
  {
    name: 'personalizedRecipeFlow',
    inputSchema: PersonalizedRecipeInputSchema,
    outputSchema: PersonalizedRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
