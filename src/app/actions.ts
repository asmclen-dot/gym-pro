'use server';

import { generatePersonalizedRecipe, PersonalizedRecipeInput } from '@/ai/flows/personalized-recipe-generation';
import { z } from 'zod';

const recipeSchema = z.object({
  ingredients: z.string().min(10, { message: 'يرجى ذكر بعض المكونات على الأقل.' }),
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
      error: 'إدخال غير صالح. يرجى التحقق من قائمة المكونات الخاصة بك.',
      message: 'فشل التحقق من الصحة.',
    };
  }

  try {
    const recipe = await generatePersonalizedRecipe(validatedFields.data as PersonalizedRecipeInput);
    return {
      data: recipe,
      error: null,
      message: 'تم إنشاء الوصفة بنجاح!',
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'حدث خطأ غير معروف.';
    return {
      data: null,
      error: `فشل إنشاء الوصفة: ${errorMessage}`,
      message: 'فشل إنشاء الذكاء الاصطناعي.',
    };
  }
}
