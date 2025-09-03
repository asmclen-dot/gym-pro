import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-recipe-generation.ts';
import '@/ai/flows/workout-calorie-estimation.ts';
import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/generate-fitness-report.ts';
import '@/ai/flows/suggest-fitness-goals.ts';
