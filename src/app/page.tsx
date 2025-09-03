import { Header } from '@/components/header';
import { Stats } from '@/components/stats';
import { FoodTracker } from '@/components/food-tracker';
import { ActivityTracker } from '@/components/activity-tracker';
import { HabitTracker } from '@/components/habit-tracker';
import { RecipeGenerator } from '@/components/recipe-generator';
import { Achievements } from '@/components/achievements';
import { UserProfile } from '@/components/user-profile';
import { AIWorkoutPlanner } from '@/components/ai-workout-planner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <Stats />
            </div>

            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <FoodTracker />
              <AIWorkoutPlanner />
              <ActivityTracker />
            </div>

            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              <UserProfile />
              <RecipeGenerator />
              <HabitTracker />
              <Achievements />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
