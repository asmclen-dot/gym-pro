'use server';

/**
 * @fileOverview Workout plan generation flow.
 *
 * This file defines a Genkit flow that takes user goals and a number of days
 * and generates a personalized workout plan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkoutPlanInputSchema = z.object({
  days: z.number().describe("The number of workout days for the workout plan (e.g., 3, 5)."),
  goals: z.string().describe("The user's fitness goals (e.g., 'lose weight and build muscle')."),
});
export type WorkoutPlanInput = z.infer<typeof WorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
    name: z.string().describe("The name of the exercise in Arabic."),
    reps: z.string().optional().describe("The number of repetitions (e.g., '12-15 reps')."),
    sets: z.number().optional().describe("The number of sets."),
    duration: z.string().optional().describe("The duration of the exercise (e.g., '30 minutes')."),
    notes: z.string().optional().describe("Additional notes or instructions for the exercise in Arabic."),
});

const DailyWorkoutSchema = z.object({
    day: z.number().describe("The day number (1, 2, 3, etc.)."),
    title: z.string().describe("The title for the day's workout in Arabic (e.g., 'Push Day - Chest, Shoulders, Triceps' or 'Rest Day')."),
    isRestDay: z.boolean().describe("Whether this day is a rest day or a workout day."),
    exercises: z.array(ExerciseSchema).describe("A list of exercises for the workout day. This should be empty if it's a rest day."),
});

const WorkoutPlanOutputSchema = z.object({
  plan: z.array(DailyWorkoutSchema).describe("The full, multi-day workout plan."),
});
export type WorkoutPlanOutput = z.infer<typeof WorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: WorkoutPlanInput): Promise<WorkoutPlanOutput> {
  return workoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutPlanPrompt',
  input: {schema: WorkoutPlanInputSchema},
  output: {schema: WorkoutPlanOutputSchema},
  prompt: `You are an expert fitness coach. Your role is to organize a workout schedule, not create the exercises themselves. The user's real-life coach provides the exercises.

Create a detailed, personalized workout plan schedule in Arabic based on the user's goals and the specified number of workout days. The total plan length must be a full week (7 days).

User Goals: {{{goals}}}
Number of Workout Days: {{{days}}}

The plan should be structured logically over a 7-day period, distributing the requested workout days and adding rest days automatically to complete the week. For example, if the user asks for a 3-day plan, you should create a 7-day schedule with 3 workout days and 4 rest days, intelligently spaced out (e.g., Day 1: Workout, Day 2: Rest, Day 3: Workout, Day 4: Rest, Day 5: Workout, Day 6: Rest, Day 7: Rest).

For each workout day, provide a clear title in Arabic (e.g., "يوم الدفع - صدر، أكتاف، ترايسبس"). Since the user will input their own exercises later, you should generate realistic placeholder exercises based on the day's title and the user's goals. This gives the user a template to work from.
For each placeholder exercise, specify the name, and typical sets/reps or duration.
For rest days, clearly label them as "يوم راحة" and do not include any exercises.

The entire response must be in valid JSON format, strictly following the output schema. Do not include any text before or after the JSON object. All text content must be in Arabic. The final plan must contain exactly 7 days.
`,
});

const workoutPlanFlow = ai.defineFlow(
  {
    name: 'workoutPlanFlow',
    inputSchema: WorkoutPlanInputSchema,
    outputSchema: WorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
