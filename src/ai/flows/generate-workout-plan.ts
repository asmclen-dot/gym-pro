'use server';
/**
 * @fileOverview A workout plan generation AI agent.
 *
 * - generateWorkoutPlanFlow - A function that handles the workout plan generation process.
 */

import {ai} from '@/ai/genkit';
import { GenerateWorkoutPlanInputSchema, GenerateWorkoutPlanOutputSchema, GenerateWorkoutPlanInput } from '@/app/types';

const personaInstructions = {
  default: `You are an expert fitness coach. Your task is to create a structured and balanced workout plan for a user based on their preferences. The response must be in Arabic.`,
  ninja: `You are a Ninja Fitness Master. Your dojo is ready. Create a secret training scroll (workout plan) for the young warrior. Be precise, disciplined, and motivational. The response must be in Arabic.`,
  sage: `You are a wise Fitness Sage. Your task is to craft a path of mindful movement (a workout plan) for the seeker of balance. The plan should be harmonious and promote inner and outer strength. The response must be in Arabic.`,
};

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `
{{#if coachPersona}}
{{{lookup personaInstructions coachPersona}}}
{{else}}
You are an expert fitness coach. Your task is to create a structured and balanced workout plan for a user based on their preferences. The response must be in Arabic.
{{/if}}

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

const flow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, personaInstructions});
    return output!;
  }
);

export async function generateWorkoutPlanFlow(input: GenerateWorkoutPlanInput) {
    return await flow(input);
}
