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

const ExerciseDetailSchema = z.object({
  name: z.string().describe("The name of the exercise."),
  type: z.enum(['strength', 'cardio', 'flexibility']).describe("The type of exercise."),
  sets: z.number().optional().describe("The number of sets performed."),
  reps: z.number().optional().describe("The number of repetitions per set."),
  durationInMinutes: z.number().optional().describe("The duration of the exercise in minutes."),
  weight: z.number().optional().describe("The weight used for the exercise in kilograms.")
});
export type ExerciseDetail = z.infer<typeof ExerciseDetailSchema>;


const WorkoutCalorieEstimationInputSchema = z.object({
  exerciseName: z.string().optional().describe("The name of the exercise, e.g., 'Running', 'Weightlifting'."),
  durationInMinutes: z.number().optional().describe("The duration of the exercise in minutes."),
  sets: z.number().optional().describe("The number of sets for the exercise."),
  reps: z.number().optional().describe("The number of repetitions per set."),
  exercises: z.array(ExerciseDetailSchema).optional().describe("A list of all exercises performed in a single workout session.")
});
export type WorkoutCalorieEstimationInput = z.infer<typeof WorkoutCalorieEstimationInputSchema>;

const WorkoutCalorieEstimationOutputSchema = z.object({
    estimatedCalories: z.number().describe("The estimated total number of calories burned during the entire workout."),
});
export type WorkoutCalorieEstimationOutput = z.infer<typeof WorkoutCalorieEstimationOutputSchema>;

export async function estimateWorkoutCalories(input: WorkoutCalorieEstimationInput): Promise<WorkoutCalorieEstimationOutput> {
  return workoutCalorieEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutCalorieEstimationPrompt',
  input: {schema: WorkoutCalorieEstimationInputSchema},
  output: {schema: WorkoutCalorieEstimationOutputSchema},
  prompt: `You are a fitness expert. Your task is to estimate the total calories burned for a workout session.
The user will provide either a single exercise or a list of exercises for a full day's workout.
Base your estimation on an average person's metabolism (e.g., 80kg male).

{{#if exercises}}
This is a full day workout. Calculate the total estimated calories for all exercises combined.

List of exercises:
{{#each exercises}}
- Exercise: {{name}} ({{type}})
  {{#if sets}}Sets: {{sets}}, Reps: {{reps}}{{/if}}
  {{#if weight}} with {{weight}}kg{{/if}}
  {{#if durationInMinutes}}Duration: {{durationInMinutes}} minutes{{/if}}
{{/each}}

Sum up the calories for all exercises to provide a single total estimate for the session.
{{else}}
This is a single exercise. Calculate the estimated calories for it.

Exercise: {{{exerciseName}}}
{{#if durationInMinutes}}
Duration: {{{durationInMinutes}}} minutes
{{/if}}
{{#if sets}}
Sets: {{{sets}}}
Reps per set: {{{reps}}}
{{/if}}
{{/if}}

The response must be in JSON format and only contain the estimated total calories for the entire workout provided.
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
