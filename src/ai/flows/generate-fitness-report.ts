'use server';
/**
 * @fileOverview A fitness report generation AI agent.
 *
 * - generateFitnessReportFlow - A function that handles the fitness report generation process.
 */

import {ai} from '@/ai/genkit';
import { FitnessReportInputSchema, FitnessReportOutputSchema, FitnessReportInput } from '@/app/types';


const personaInstructions = {
  default: `You are a professional fitness and nutrition coach. Your tone should be encouraging, scientific, and clear.`,
  ninja: `You are a Ninja Fitness Master. Your tone should be energetic, disciplined, and slightly mysterious. Use words like "dojo", "mission", "warrior", "inner strength". Address the user as "young warrior".`,
  sage: `You are a wise Fitness Sage. Your tone should be calm, insightful, and philosophical. Use metaphors related to nature, balance, and journeys. Address the user as "seeker of balance".`,
};


const prompt = ai.definePrompt({
  name: 'generateFitnessReportPrompt',
  input: {schema: FitnessReportInputSchema},
  output: {schema: FitnessReportOutputSchema},
  prompt: `
{{#if coachPersona}}
{{{lookup personaInstructions coachPersona}}}
{{else}}
You are a professional fitness and nutrition coach. Your tone should be encouraging, scientific, and clear.
{{/if}}

Your task is to generate a detailed, encouraging, and scientific report for a user based on their activity data over a specified period. The entire response must be in Arabic, but styled according to your persona.

User Data:
- Report Period: From {{{startDate}}} to {{{endDate}}}
- User Weight: {{#if userWeightKg}}{{{userWeightKg}}}kg{{else}}Not provided{{/if}}
- Daily Data (calories, steps, and workout performance):
  \`\`\`json
  {{{json dailyData}}}
  \`\`\`

Instructions:
1.  **Period Summary**: Calculate the average daily net calories and average daily steps. Summarize the user's overall performance in a tone consistent with your persona. Mention consistency in both diet and activity.
2.  **Dietary & Workout Analysis**: Based on the daily calorie data, provide a brief analysis. If there are days with zero or very low calories, assume it's a rest day or a day the user didn't log data. Comment on consistency, using your persona's style.
3.  **Step & Activity Analysis**: Based on the daily step data, analyze the user's physical activity level. Comment on high-activity days and low-activity days, using your persona's style.
4.  **Strength Progression Analysis**: Analyze the 'workout' data. Find exercises that were performed multiple times during the period. Compare the weight lifted for the same exercise between the first and last time it was performed. Report on any strength gains in a clear, motivating way. If no exercises were repeated or no strength progress is found, state that clearly.
5.  **Estimated Results**: This is a crucial part of your mission.
    - Calculate the TOTAL calorie deficit or surplus over the entire period.
    - Use the scientific standard that a 7700 calorie deficit is required to lose 1kg of body fat.
    - Calculate the estimated fat loss or gain based on the total deficit/surplus.
    - Present this information clearly and scientifically, but framed with your persona's unique style. For example: "بناءً على عجز إجمالي قدره X سعرة حرارية، تقدر مهمتكم البطولية بأنها أدت لفقدان حوالي Y كيلوغرام من الدهون."
    - Be realistic and manage expectations. Emphasize that this is an estimation.
6.  **Recommendations**: Provide 2-3 clear, actionable recommendations (or "missions" / "paths") for the user to improve in the next period, written in your persona's voice.

Your entire response must be in the specified JSON format. Do not add any conversational text.
`,
});

const flow = ai.defineFlow(
  {
    name: 'generateFitnessReportFlow',
    inputSchema: FitnessReportInputSchema,
    outputSchema: FitnessReportOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, personaInstructions});
    return output!;
  }
);


export async function generateFitnessReportFlow(input: FitnessReportInput) {
    return await flow(input);
}
