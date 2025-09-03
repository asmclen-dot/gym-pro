'use server';
/**
 * @fileOverview A workout plan generation AI agent.
 *
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExerciseSchema = z.object({
    id: z.string().describe("A unique identifier for the exercise, like a UUID."),
    name: z.string().describe("The name of the exercise in Arabic."),
    type: z.enum(['strength', 'cardio', 'flexibility']).describe("The type of exercise."),
    targetSets: z.number().optional().describe("The target number of sets. Only for 'strength' type."),
    targetReps: z.number().optional().describe("The target number of repetitions per set. Only for 'strength' type."),
    targetDuration: z.number().optional().describe("The target duration of the exercise in minutes. Only for 'cardio' or 'flexibility' types."),
    targetWeight: z.number().optional().describe("The suggested starting weight for the exercise in kilograms. Only for 'strength' type."),
    done: z.boolean().optional().default(false).describe("Whether the exercise has been completed."),
});

const WorkoutDaySchema = z.object({
    day: z.number().describe("The day number of the workout, e.g., 1, 2, 3."),
    targetTime: z.enum(['morning', 'afternoon', 'evening', '']).describe("The target time of day for the workout."),
    exercises: z.array(ExerciseSchema).describe("A list of exercises for this specific day."),
});


export const GenerateWorkoutPlanInputSchema = z.object({
  daysPerWeek: z.number().min(1).max(7).describe("The number of days the user wants to work out per week."),
  workoutType: z.enum(['strength', 'cardio', 'mixed']).describe("The primary focus of the workout plan."),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

export const GenerateWorkoutPlanOutputSchema = z.object({
    plan: z.array(WorkoutDaySchema).describe("The generated workout plan, with one entry per workout day."),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;


export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are an expert fitness coach. Your task is to create a structured and balanced workout plan for a user based on their preferences. The response must be in Arabic.

User Preferences:
- Days per week: {{{daysPerWeek}}}
- Workout type: {{{workoutType}}}

Instructions:
1.  Create a workout plan for the specified number of days.
2.  The plan should be logical and well-distributed. For strength or mixed plans, ensure proper muscle group splits (e.g., Push/Pull/Legs, Upper/Lower, or specific muscle groups per day) to allow for recovery. Avoid working the same muscle group on consecutive days.
3.  For each day, provide a reasonable number of exercises (e.g., 4-6 for strength, 1-3 for cardio).
4.  For each exercise, provide realistic target values (sets, reps, weight for strength; duration for cardio/flexibility). Assume the user is a beginner to intermediate.
5.  All exercise names and descriptions MUST be in Arabic.
6.  Each exercise must have a unique ID, you can generate a random UUID for this.
7.  Return the plan in the specified JSON format. Ensure it strictly follows the output schema.
8.  Do not include any introductory or conversational text in your response. Only the JSON object is required.
`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
