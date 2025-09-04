'use server';
/**
 * @fileOverview A fitness report generation AI agent.
 *
 * - generateFitnessReportFlow - A function that handles the fitness report generation process.
 */

import {ai} from '@/ai/genkit';
import { FitnessReportInputSchema, FitnessReportOutputSchema, FitnessReportInput } from '@/app/types';


const prompt = ai.definePrompt({
  name: 'generateFitnessReportPrompt',
  input: {schema: FitnessReportInputSchema},
  output: {schema: FitnessReportOutputSchema},
  prompt: `You are a professional fitness and nutrition coach. Your task is to generate a detailed, encouraging, and scientific report for a user based on their activity data over a specified period. The entire response must be in Arabic.

User Data:
- Report Period: From {{{startDate}}} to {{{endDate}}}
- User Weight: {{#if userWeightKg}}{{{userWeightKg}}}kg{{else}}Not provided{{/if}}
- Daily Data (calories are net calories, combining food intake and exercise; steps are also included):
  \`\`\`json
  {{{json dailyData}}}
  \`\`\`

Instructions:
1.  **Period Summary**: Calculate the average daily net calories and average daily steps. Summarize the user's overall performance in an encouraging tone. Mention consistency in both diet and activity.
2.  **Dietary & Workout Analysis**: Based on the daily calorie data, provide a brief analysis. If there are days with zero or very low calories, assume it's a rest day or a day the user didn't log data. Comment on consistency.
3.  **Step & Activity Analysis**: Based on the daily step data, analyze the user's physical activity level. Comment on high-activity days and low-activity days.
4.  **Estimated Results**: This is the most important part.
    - Calculate the TOTAL calorie deficit or surplus over the entire period.
    - Use the scientific standard that a 7700 calorie deficit is required to lose 1kg of body fat.
    - Calculate the estimated fat loss or gain based on the total deficit/surplus.
    - Present this information clearly and scientifically, for example: "بناءً على عجز إجمالي قدره X سعرة حرارية، يُقدر أنك فقدت حوالي Y كيلوغرام من الدهون."
    - Be realistic and manage expectations. Emphasize that this is an estimation.
5.  **Recommendations**: Provide 2-3 clear, actionable recommendations for the user to improve in the next period. These can be about diet, workout intensity, or daily step count.

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
    // Replace the analysis prompt to add step analysis
    const newPrompt = ai.definePrompt({
        name: 'generateFitnessReportPrompt',
        input: {schema: FitnessReportInputSchema},
        output: {schema: FitnessReportOutputSchema},
        prompt: `You are a professional fitness and nutrition coach. Your task is to generate a detailed, encouraging, and scientific report for a user based on their activity data over a specified period. The entire response must be in Arabic.

User Data:
- Report Period: From {{{startDate}}} to {{{endDate}}}
- User Weight: {{#if userWeightKg}}{{{userWeightKg}}}kg{{else}}Not provided{{/if}}
- Daily Data (calories are net calories, combining food intake and exercise; steps are also included):
  \`\`\`json
  {{{json dailyData}}}
  \`\`\`

Instructions:
1.  **Period Summary**: Calculate the average daily net calories and average daily steps. Summarize the user's overall performance in an encouraging tone. Mention consistency in both diet and activity.
2.  **Dietary & Workout Analysis**: Based on the daily calorie data, provide a brief analysis. If there are days with zero or very low calories, assume it's a rest day or a day the user didn't log data. Comment on consistency.
3.  **Estimated Results**: This is the most important part.
    - Calculate the TOTAL calorie deficit or surplus over the entire period.
    - Use the scientific standard that a 7700 calorie deficit is required to lose 1kg of body fat.
    - Calculate the estimated fat loss or gain based on the total deficit/surplus.
    - Present this information clearly and scientifically, for example: "بناءً على عجز إجمالي قدره X سعرة حرارية، يُقدر أنك فقدت حوالي Y كيلوغرام من الدهون."
    - Be realistic and manage expectations. Emphasize that this is an estimation.
4.  **Recommendations**: Provide 2-3 clear, actionable recommendations for the user to improve in the next period. These can be about diet, workout intensity, or daily step count.

Your entire response must be in the specified JSON format. Do not add any conversational text.
`,
    });
    const {output} = await newPrompt(input);
    return output!;
  }
);


export async function generateFitnessReportFlow(input: FitnessReportInput) {
    return await flow(input);
}
