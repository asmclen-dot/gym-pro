'use server';

/**
 * @fileOverview A workout calorie estimation AI agent.
 *
 * - estimateWorkoutCalories - A function that handles the calorie estimation for a workout.
 * - WorkoutCalorieEstimationInput - The input type for the estimateWorkoutCalories function.
 * - WorkoutCalorieEstimationOutput - The return type for the estimateWorkoutCalories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkoutCalorieEstimationInputSchema = z.object({
  exerciseName: z.string().describe("The name of the exercise, e.g., 'Running', 'Weightlifting'."),
  durationInMinutes: z.number().describe("The duration of the exercise in minutes."),
});
export type WorkoutCalorieEstimationInput = z.infer<typeof WorkoutCalorieEstimationInputSchema>;

const WorkoutCalorieEstimationOutputSchema = z.object({
    estimatedCalories: z.number().describe("The estimated number of calories burned during the exercise."),
});
export type WorkoutCalorieEstimationOutput = z.infer<typeof WorkoutCalorieEstimationOutputSchema>;

export async function estimateWorkoutCalories(input: WorkoutCalorieEstimationInput): Promise<WorkoutCalorieEstimationOutput> {
  return workoutCalorieEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutCalorieEstimationPrompt',
  input: {schema: WorkoutCalorieEstimationInputSchema},
  output: {schema: WorkoutCalorieEstimationOutputSchema},
  prompt: `You are a fitness expert. Your task is to estimate the calories burned for a specific exercise and duration.

Exercise: {{{exerciseName}}}
Duration: {{{durationInMinutes}}} minutes

Provide an estimated calorie count for this workout. Base your estimation on an average person's metabolism.
The response must be in JSON format and only contain the estimated calories.
`,
});

const workoutCalorieEstimationFlow = ai.defineFlow(
  {
    name: 'workoutCalorieEstimationFlow',
    inputSchema: WorkoutCalorieEstimationInputSchema,
    outputSchema: WorkoutCalorieEstimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
