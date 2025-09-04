
'use server';
/**
 * @fileOverview Generates content for the post-workout cooldown zone.
 *
 * - getCooldownContentFlow - A function that returns a nutritional tip and a motivational quote.
 */
import { ai } from '@/ai/genkit';
import { CooldownContentOutputSchema, CooldownContentOutput } from '@/app/types';

const prompt = ai.definePrompt({
  name: 'getCooldownContentPrompt',
  output: { schema: CooldownContentOutputSchema },
  prompt: `You are a world-class fitness and wellness coach.
Your task is to provide a user with a piece of content for their post-workout "cooldown zone".
The content must be in Arabic.
Generate one short, actionable, and scientific nutritional tip AND one powerful, concise motivational quote related to fitness, perseverance, or health.
The entire response must be in the specified JSON format. Do not add any conversational text.
`,
});

const flow = ai.defineFlow(
  {
    name: 'getCooldownContentFlow',
    outputSchema: CooldownContentOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    return output!;
  }
);

export async function getCooldownContentFlow(): Promise<CooldownContentOutput> {
  return await flow();
}
