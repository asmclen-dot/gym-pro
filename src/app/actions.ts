'use server';

import { generatePersonalizedRecipe, PersonalizedRecipeInput } from '@/ai/flows/personalized-recipe-generation';
import { estimateWorkoutCalories, WorkoutCalorieEstimationInput } from '@/ai/flows/workout-calorie-estimation';
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

const workoutSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("time"),
    exerciseName: z.string().min(3, { message: 'يرجى إدخال اسم تمرين صالح.' }),
    durationInMinutes: z.coerce.number().min(1, { message: 'يجب أن تكون المدة دقيقة واحدة على الأقل.' }),
  }),
  z.object({
    type: z.literal("reps"),
    exerciseName: z.string().min(3, { message: 'يرجى إدخال اسم تمرين صالح.' }),
    sets: z.coerce.number().min(1, { message: 'يجب أن تكون هناك مجموعة واحدة على الأقل.' }),
    reps: z.coerce.number().min(1, { message: 'يجب أن يكون هناك تكرار واحد على الأقل.' }),
  }),
]);


export type WorkoutState = {
  data: Awaited<ReturnType<typeof estimateWorkoutCalories>> | null;
  error: string | null;
  message: string | null;
  input?: WorkoutCalorieEstimationInput;
};


export async function getWorkoutCaloriesAction(prevState: WorkoutState, formData: FormData): Promise<WorkoutState> {
  const type = formData.get('type') === 'reps' ? 'reps' : 'time';
  
  const rawData = {
    type,
    exerciseName: formData.get('exerciseName'),
    durationInMinutes: formData.get('durationInMinutes'),
    sets: formData.get('sets'),
    reps: formData.get('reps'),
  };

  const validatedFields = workoutSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      data: null,
      error: `إدخال غير صالح: ${errorMessages}`,
      message: 'فشل التحقق من الصحة.',
    };
  }
  
  const { type: _type, ...input } = validatedFields.data;

  try {
    const workoutCalories = await estimateWorkoutCalories(input);
    return {
      data: workoutCalories,
      error: null,
      message: 'تم حساب السعرات الحرارية بنجاح!',
      input,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'حدث خطأ غير معروف.';
    return {
      data: null,
      error: `فشل حساب السعرات الحرارية: ${errorMessage}`,
      message: 'فشل إنشاء الذكاء الاصطناعي.',
      input
    };
  }
}
