'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Medal, Star, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const badges = [
  { name: 'الخطوات الأولى', date: '1 يونيو 2024', icon: <Star />, achieved: true },
  { name: 'سلسلة 7 أيام', date: '7 يونيو 2024', icon: <Medal />, achieved: true },
  { name: 'أسبوع مثالي', date: 'لم يتم بعد', icon: <Trophy />, achieved: false },
  { name: 'إنجاز: 5 كجم', date: 'لم يتم بعد', icon: <Award />, achieved: false },
];

export function Achievements() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">الإنجازات</CardTitle>
        <CardDescription>احتفل بتقدمك!</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
          <div className="grid grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex flex-col items-center justify-center aspect-square gap-2 p-2 rounded-lg transition-all duration-300",
                    badge.achieved ? 'bg-accent/80 scale-100' : 'bg-muted/50 scale-90 opacity-60'
                  )}>
                    <div className={cn(
                      "p-3 rounded-full",
                      badge.achieved ? 'bg-accent' : 'bg-muted'
                    )}>
                      {React.cloneElement(badge.icon, { className: cn(
                        "h-6 w-6",
                        badge.achieved ? 'text-primary animate-pulse' : 'text-muted-foreground'
                      )})}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.achieved ? `تم الحصول عليه: ${badge.date}` : "لم يتم الحصول عليه بعد"}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
