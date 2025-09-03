'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Medal, Star, Trophy, Flame, Dumbbell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const allAchievements = [
  { name: 'الخطوات الأولى', description: 'أكملت أول يوم تمرين.', date: '1 يونيو 2024', icon: <Star />, achieved: true, category: 'التزام' },
  { name: 'سلسلة 7 أيام', description: 'أكملت 7 أيام متتالية من التمارين.', date: '7 يونيو 2024', icon: <Flame />, achieved: true, category: 'التزام' },
  { name: 'أسبوع مثالي', description: 'أكملت جميع تمارين الأسبوع.', date: 'لم يتم بعد', icon: <Trophy />, achieved: false, category: 'التزام' },
  { name: 'نصف ماراثون', description: 'أكملت 21 كم من الجري.', date: 'لم يتم بعد', icon: <Medal />, achieved: false, category: 'كارديو' },
  { name: 'إنجاز: 5 كجم', description: 'وصلت إلى هدف وزن جديد.', date: 'لم يتم بعد', icon: <Award />, achieved: false, category: 'أهداف' },
  { name: 'وحش الأثقال', description: 'رفعت ما مجموعه 1000 كجم في جلسة واحدة.', date: 'لم يتم بعد', icon: <Dumbbell />, achieved: false, category: 'قوة' },
];

const categories = ['التزام', 'قوة', 'كارديو', 'أهداف'];

export function Achievements() {
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
              {allAchievements.filter(a => a.category === category).map((badge, index) => (
                <TooltipProvider key={index} delayDuration={0}>
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
