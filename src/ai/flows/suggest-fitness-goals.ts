'use server';
/**
 * @fileOverview Suggests fitness goals based on user metrics.
 *
 * - suggestFitnessGoalsFlow - A function that suggests weekly calories and daily steps.
 */
import { ai } from '@/ai/genkit';
import { SuggestFitnessGoalsInputSchema, SuggestFitnessGoalsOutputSchema, SuggestFitnessGoalsInput, SuggestFitnessGoalsOutput } from '@/app/types';


const prompt = ai.definePrompt({
  name: 'suggestFitnessGoalsPrompt',
  input: { schema: SuggestFitnessGoalsInputSchema },
  output: { schema: SuggestFitnessGoalsOutputSchema },
  prompt: `You are an expert fitness and nutrition calculator.
Your task is to calculate and suggest a weekly calorie target and a daily steps target based on the user's provided data.

User Data:
- Weight: {{{weight}}} kg
- Height: {{{height}}} cm
- Age: {{{age}}} years
- Gender: {{{gender}}}
- Goal: {{{goal}}}

Calculation Steps:
1.  **Calculate Basal Metabolic Rate (BMR)** using the Mifflin-St Jeor equation:
    - For men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
    - For women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
2.  **Calculate Total Daily Energy Expenditure (TDEE)** by multiplying BMR by an activity factor. Assume a "lightly active" lifestyle (BMR * 1.375) as a baseline.
3.  **Adjust TDEE based on the user's goal** to find the daily calorie target:
    - For 'lose_weight': Subtract 500 calories from TDEE.
    - For 'maintain': Use the TDEE as is.
    - For 'gain_muscle': Add 300-500 calories to TDEE. Use 400 as a standard.
4.  **Calculate the suggested weekly calorie target** by multiplying the final daily calorie target by 7.
5.  **Suggest a daily step target**:
    - For 'lose_weight': 10,000 steps.
    - For 'maintain': 8,000 steps.
    - For 'gain_muscle': 6,000 steps is sufficient as the focus is on resistance training.
6.  Return the final numbers in the specified JSON format. The numbers should be rounded to the nearest integer.
`,
});

const flow = ai.defineFlow(
  {
    name: 'suggestFitnessGoalsFlow',
    inputSchema: SuggestFitnessGoalsInputSchema,
    outputSchema: SuggestFitnessGoalsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function suggestFitnessGoalsFlow(
  input: SuggestFitnessGoalsInput
): Promise<SuggestFitnessGoalsOutput> {
  return await flow(input);
}
