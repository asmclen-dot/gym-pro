"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Footprints, Target, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from '@/lib/utils';

const chartData = [
  { day: "الاثنين", calories: 800, steps: 5000 },
  { day: "الثلاثاء", calories: 1200, steps: 7500 },
  { day: "الأربعاء", calories: 950, steps: 6000 },
  { day: "الخميس", calories: 1500, steps: 10000 },
  { day: "الجمعة", calories: 1300, steps: 8500 },
  { day: "السبت", calories: 1800, steps: 12000 },
  { day: "الأحد", calories: 1600, steps: 9000 },
]

const chartConfig = {
  calories: {
    label: "السعرات",
    color: "hsl(var(--primary))",
  },
  steps: {
    label: "الخطوات",
    color: "hsl(var(--accent-foreground))",
  },
}

export function Stats() {
  const [activeChart, setActiveChart] = React.useState<"calories" | "steps">("calories");

  const totalCalories = chartData.reduce((acc, curr) => acc + curr.calories, 0);
  const totalSteps = chartData.reduce((acc, curr) => acc + curr.steps, 0);
  const points = Math.floor(totalCalories / 10 + totalSteps / 100);
  const streak = 4;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">ملخص الأسبوع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-center">
            <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="size-5" />
                <span className="font-semibold">إجمالي السعرات</span>
              </div>
              <span className="text-2xl font-bold font-mono">{totalCalories.toLocaleString()}</span>
            </div>
             <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Footprints className="size-5" />
                <span className="font-semibold">مجموع الخطوات</span>
              </div>
              <span className="text-2xl font-bold font-mono">{totalSteps.toLocaleString()}</span>
            </div>
             <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-5" />
                <span className="font-semibold">النقاط المكتسبة</span>
              </div>
              <span className="text-2xl font-bold font-mono">{points}</span>
            </div>
             <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="size-5" />
                <span className="font-semibold">أيام متتالية</span>
              </div>
              <span className="text-2xl font-bold font-mono">{streak}</span>
            </div>
        </div>

        <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                <Bar dataKey="steps" fill="var(--color-steps)" radius={4} />
              </BarChart>
            </ChartContainer>
        </div>

      </CardContent>
    </Card>
  );
}
