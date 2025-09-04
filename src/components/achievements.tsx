'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Medal, Star, Trophy, Flame, Dumbbell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactElement;
    category: 'التزام' | 'قوة' | 'كارديو' | 'أهداف';
    achieved: boolean;
    date?: string;
    check: (data: any) => { achieved: boolean; date?: string };
}

// Helper function to get streak
const getStreak = () => {
    const today = new Date();
    let consecutiveDays = 0;
    for (let i = 0; i < 365; i++) { // Check up to a year back
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const storedData = localStorage.getItem(dateString);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const hasActivity = (parsedData.foods?.length > 0) || (parsedData.workoutCalories > 0) || (parsedData.steps > 0) || (parsedData.habits && Object.values(parsedData.habits).some(h => h));
            if (hasActivity) {
                consecutiveDays++;
            } else {
                break; // Streak is broken
            }
        } else {
            break; // No data for this day, streak is broken
        }
    }
    return consecutiveDays;
};


const initialAchievements: Omit<Achievement, 'achieved' | 'date'>[] = [
  { id: 'first_workout', name: 'الخطوات الأولى', description: 'أكملت أول يوم تمرين.', icon: <Star />, category: 'التزام',
    check: () => {
      // Find the first day a workout was completed
      const today = new Date();
      for(let i=0; i < 365; i++) {
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const storedData = localStorage.getItem(dateString);
        if(storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.workoutCalories > 0) {
            return { achieved: true, date: format(date, 'd MMM yyyy') };
          }
        }
      }
      return { achieved: false };
    }
  },
  { id: '7_day_streak', name: 'سلسلة 7 أيام', description: 'أكملت 7 أيام متتالية من النشاط.', icon: <Flame />, category: 'التزام',
    check: () => {
        const streak = getStreak();
        return { achieved: streak >= 7 };
    }
   },
  { id: 'perfect_week', name: 'أسبوع مثالي', description: 'أكملت جميع تمارين الأسبوع.', icon: <Trophy />, category: 'التزام', check: () => ({ achieved: false }) },
  { id: 'half_marathon', name: 'نصف ماراثون', description: 'أكملت 21 كم من الجري.', icon: <Medal />, category: 'كارديو', check: () => ({ achieved: false }) },
  { id: 'lose_5kg', name: 'إنجاز: 5 كجم', description: 'وصلت إلى هدف وزن جديد.', icon: <Award />, category: 'أهداف', check: () => ({ achieved: false }) },
  { id: 'weight_monster', name: 'وحش الأثقال', description: 'رفعت ما مجموعه 1000 كجم في جلسة واحدة.', icon: <Dumbbell />, category: 'قوة', check: () => ({ achieved: false }) },
];

const categories = ['التزام', 'قوة', 'كارديو', 'أهداف'];

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // This logic runs on the client, where localStorage is available.
    const checkedAchievements = initialAchievements.map(a => {
        const result = a.check({}); // Pass any necessary data here in the future
        return {
            ...a,
            achieved: result.achieved,
            date: result.achieved ? (result.date || format(new Date(), 'd MMM yyyy')) : "لم يتم بعد",
        }
    });
    setAchievements(checkedAchievements);
  }, []);

  if (!isClient) {
    // Render a skeleton or loading state while waiting for client-side execution
    return (
       <Card className="shadow-sm w-full">
            <CardHeader>
                <CardTitle className="font-headline tracking-tight text-2xl">سجل الإنجازات</CardTitle>
                <CardDescription>احتفل بتقدمك واطلق العنان لقدراتك!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 {categories.map(category => (
                    <div key={category}>
                        <div className="h-6 w-1/3 bg-muted rounded-md mb-4" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {[...Array(3)].map((_, i) => (
                               <div key={i} className="flex flex-col items-center justify-center aspect-square gap-2 p-2 rounded-lg bg-muted/50" >
                                    <div className="p-4 rounded-full bg-muted h-16 w-16" />
                                    <div className="h-4 w-20 bg-muted rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight text-2xl">سجل الإنجازات</CardTitle>
        <CardDescription>احتفل بتقدمك واطلق العنان لقدراتك!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-xl font-bold mb-4 font-headline">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {achievements.filter(a => a.category === category).map((badge) => (
                <TooltipProvider key={badge.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex flex-col items-center justify-center aspect-square gap-2 p-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1",
                        badge.achieved ? 'bg-accent/80 shadow-md scale-100' : 'bg-muted/50 scale-95 opacity-60'
                      )}>
                        <div className={cn(
                          "p-4 rounded-full relative",
                          badge.achieved ? 'bg-accent' : 'bg-muted'
                        )}>
                          {React.cloneElement(badge.icon, { className: cn(
                            "h-8 w-8",
                            badge.achieved ? 'text-primary animate-pulse' : 'text-muted-foreground'
                          )})}
                        </div>
                        <p className="text-xs text-center font-semibold">{badge.name}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{badge.name}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{badge.achieved ? `تم الحصول عليه: ${badge.date}` : "لم يتم الحصول عليه بعد"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
