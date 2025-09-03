"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Footprints, Target } from 'lucide-react';
import React from 'react';

export function Stats() {
  // Mock data
  const calorieGoal = 2000;
  const caloriesConsumed = 1250;
  const calorieProgress = (caloriesConsumed / calorieGoal) * 100;

  const stepsGoal = 10000;
  const stepsTaken = 6750;
  const stepsProgress = (stepsTaken / stepsGoal) * 100;
  
  const points = 120;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Flame className="w-5 h-5 text-red-500" />
                <span>Calories</span>
              </div>
              <span className="font-mono">{caloriesConsumed.toLocaleString()} / {calorieGoal.toLocaleString()} kcal</span>
            </div>
            <Progress value={calorieProgress} className="h-2" indicatorClassName="bg-red-500" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Footprints className="w-5 h-5 text-primary" />
                <span>Steps</span>
              </div>
              <span className="font-mono">{stepsTaken.toLocaleString()} / {stepsGoal.toLocaleString()}</span>
            </div>
            <Progress value={stepsProgress} className="h-2" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
               <div className="flex items-center gap-2 font-medium">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Points</span>
              </div>
              <span className="font-mono text-lg font-semibold text-foreground">{points}</span>
            </div>
             <div className="h-2 w-full bg-muted rounded-full mt-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
