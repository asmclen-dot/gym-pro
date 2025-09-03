'use server';

import { generatePersonalizedRecipe, PersonalizedRecipeInput } from '@/ai/flows/personalized-recipe-generation';
import { estimateWorkoutCalories, WorkoutCalorieEstimationInput, ExerciseDetail } from '@/ai/flows/workout-calorie-estimation';
import { z } from 'zod';
import { generateWorkoutPlanFlow } from '@/ai/flows/generate-workout-plan';
import { GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput, GenerateWorkoutPlanInputSchema } from './types';
import { generateFitnessReportFlow } from '@/ai/flows/generate-fitness-report';
import { FitnessReportInput, FitnessReportInputSchema, FitnessReportOutput } from './types';


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

const exerciseDetailSchema = z.object({
  name: z.string(),
  type: z.enum(['strength', 'cardio', 'flexibility']),
  sets: z.number().optional(),
  reps: z.number().optional(),
  durationInMinutes: z.number().optional(),
  weight: z.number().optional(),
});


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
  z.object({
    type: z.literal("full_day"),
    exercises: z.array(exerciseDetailSchema),
  }),
]);


export type WorkoutState = {
  data: Awaited<ReturnType<typeof estimateWorkoutCalories>> | null;
  error: string | null;
  message: string | null;
  input?: WorkoutCalorieEstimationInput;
};


export async function getWorkoutCaloriesAction(prevState: WorkoutState, formData: FormData): Promise<WorkoutState> {
    const type = formData.get('type') as string;
    let rawData: Record<string, any> = { type };

    try {
        if (type === 'full_day') {
            const exercisesStr = formData.get('exercises') as string;
            rawData.exercises = JSON.parse(exercisesStr);
            // Validate the structure of each exercise
            if (!Array.isArray(rawData.exercises) || rawData.exercises.some(ex => typeof ex !== 'object' || !ex.name || !ex.type)) {
                throw new Error("Invalid exercise structure in JSON string.");
            }
        } else {
            rawData.exerciseName = formData.get('exerciseName');
            if (formData.has('durationInMinutes')) {
                rawData.durationInMinutes = formData.get('durationInMinutes');
            }
            if (formData.has('sets')) {
                rawData.sets = formData.get('sets');
            }
            if (formData.has('reps')) {
                rawData.reps = formData.get('reps');
            }
        }
    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid JSON string for exercises.";
        return {
            data: null,
            error: `إدخال غير صالح: ${error}`,
            message: 'فشل التحقق من الصحة.',
        };
    }

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
        const workoutCalories = await estimateWorkoutCalories(input as WorkoutCalorieEstimationInput);
        return {
            data: workoutCalories,
            error: null,
            message: 'تم حساب السعرات الحرارية بنجاح!',
            input: input as WorkoutCalorieEstimationInput,
        };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'حدث خطأ غير معروف.';
        return {
            data: null,
            error: `فشل حساب السعرات الحرارية: ${errorMessage}`,
            message: 'فشل إنشاء الذكاء الاصطناعي.',
            input: input as WorkoutCalorieEstimationInput
        };
    }
}


// Action for AI workout plan generation
export type AIPlanState = {
    data: GenerateWorkoutPlanOutput | null;
    error: string | null;
    message: string | null;
};

export async function generateAIPlanAction(input: GenerateWorkoutPlanInput): Promise<AIPlanState> {
    try {
        const validatedInput = GenerateWorkoutPlanInputSchema.parse(input);
        const plan = await generateWorkoutPlanFlow(validatedInput);
        return {
            data: plan,
            error: null,
            message: 'تم إنشاء الخطة بنجاح!',
        };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'حدث خطأ غير معروف.';
        return {
            data: null,
            error: `فشل إنشاء الخطة: ${errorMessage}`,
            message: 'فشل إنشاء الذكاء الاصطناعي.',
        };
    }
}


export type ReportState = {
  data: FitnessReportOutput | null;
  error: string | null;
  message: string | null;
};

export async function getReportAction(input: FitnessReportInput): Promise<ReportState> {
  const validatedFields = FitnessReportInputSchema.safeParse(input);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      data: null,
      error: `إدخال غير صالح: ${errorMessages}`,
      message: 'فشل التحقق من الصحة.',
    };
  }

  try {
    const report = await generateFitnessReportFlow(validatedFields.data);
    return {
      data: report,
      error: null,
      message: 'تم إنشاء التقرير بنجاح!',
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'حدث خطأ غير معروف.';
    return {
      data: null,
      error: `فشل إنشاء التقرير: ${errorMessage}`,
      message: 'فشل إنشاء الذكاء الاصطناعي.',
    };
  }
}
