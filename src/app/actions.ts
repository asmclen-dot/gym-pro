'use server';

import { generatePersonalizedRecipe, PersonalizedRecipeInput } from '@/ai/flows/personalized-recipe-generation';
import { estimateWorkoutCalories, WorkoutCalorieEstimationInput, ExerciseDetail } from '@/ai/flows/workout-calorie-estimation';
import { generateWorkoutPlanFlow } from '@/ai/flows/generate-workout-plan';
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
  const type = formData.get('type');
  
  const rawData: Record<string, any> = {
    type,
  };

  if (type === 'full_day') {
    try {
        const exercisesStr = formData.get('exercises') as string;
        rawData.exercises = JSON.parse(exercisesStr);
    } catch (e) {
        return {
            data: null,
            error: "Invalid JSON string for exercises.",
            message: 'فشل التحقق من الصحة.',
        };
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
export const AIExerciseSchema = z.object({
    id: z.string().describe("A unique identifier for the exercise, like a UUID."),
    name: z.string().describe("The name of the exercise in Arabic."),
    type: z.enum(['strength', 'cardio', 'flexibility']).describe("The type of exercise."),
    targetSets: z.number().optional().describe("The target number of sets. Only for 'strength' type."),
    targetReps: z.number().optional().describe("The target number of repetitions per set. Only for 'strength' type."),
    targetDuration: z.number().optional().describe("The target duration of the exercise in minutes. Only for 'cardio' or 'flexibility' types."),
    targetWeight: z.number().optional().describe("The suggested starting weight for the exercise in kilograms. Only for 'strength' type."),
    done: z.boolean().optional().default(false).describe("Whether the exercise has been completed."),
});

export const AIWorkoutDaySchema = z.object({
    day: z.number().describe("The day number of the workout, e.g., 1, 2, 3."),
    targetTime: z.enum(['morning', 'afternoon', 'evening', '']).describe("The target time of day for the workout."),
    exercises: z.array(AIExerciseSchema).describe("A list of exercises for this specific day."),
});

export const GenerateWorkoutPlanInputSchema = z.object({
  daysPerWeek: z.number().min(1).max(7).describe("The number of days the user wants to work out per week."),
  workoutType: z.enum(['strength', 'cardio', 'mixed']).describe("The primary focus of the workout plan."),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

export const GenerateWorkoutPlanOutputSchema = z.object({
    plan: z.array(AIWorkoutDaySchema).describe("The generated workout plan, with one entry per workout day."),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;


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
