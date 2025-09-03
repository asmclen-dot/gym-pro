'use server';

import { generatePersonalizedRecipe, PersonalizedRecipeInput } from '@/ai/flows/personalized-recipe-generation';
import { z } from 'zod';

const recipeSchema = z.object({
  ingredients: z.string().min(10, { message: 'Please list at least a few ingredients.' }),
  dietaryNeeds: z.string().optional(),
});

export type RecipeState = {
  data: Awaited<ReturnType<typeof generatePersonalizedRecipe>> | null;
  error: string | null;
  message: string | null;
};

export async function getRecipeAction(prevState: RecipeState, formData: FormData): Promise<RecipeState> {
  const validatedFields = recipeSchema.safeParse({
    ingredients: formData.get('ingredients'),
    dietaryNeeds: formData.get('dietaryNeeds'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please check your ingredients list.',
      message: 'Validation failed.',
    };
  }

  try {
    const recipe = await generatePersonalizedRecipe(validatedFields.data as PersonalizedRecipeInput);
    return {
      data: recipe,
      error: null,
      message: 'Recipe generated successfully!',
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      data: null,
      error: `Failed to generate recipe: ${errorMessage}`,
      message: 'AI generation failed.',
    };
  }
}
