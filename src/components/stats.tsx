"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Footprints, Target, Zap, BarChart as BarChartIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from 'date-fns';
import { arSA } from 'date-fns/locale';


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

interface DailyData {
    date: string;
    calories: number;
    steps: number;
}


export function Stats() {
  const [chartData, setChartData] = useState<DailyData[]>([]);
  
  useEffect(() => {
    // This effect runs only on the client side
    const today = new Date();
    const weekData: DailyData[] = [];
    let consecutiveDays = 0;
    let currentStreak = 0;

    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const storedData = localStorage.getItem(dateString);
        let dayCalories = 0;
        
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            dayCalories = parsedData.calories || 0;
            if(dayCalories > 0) {
              consecutiveDays++;
            } else {
              consecutiveDays = 0;
            }
        } else {
          consecutiveDays = 0;
        }

        if(consecutiveDays > currentStreak) {
            currentStreak = consecutiveDays;
        }

        weekData.push({
            date: format(date, 'eeee', { locale: arSA }), // 'الأحد', 'الاثنين', etc.
            calories: dayCalories,
            steps: 0, // Placeholder for now
        });
    }

    const todayString = format(today, 'yyyy-MM-dd');
    const storedToday = localStorage.getItem(todayString);
    if(storedToday) {
        if(JSON.parse(storedToday).calories === 0) {
            consecutiveDays = 0;
        }
    } else {
        consecutiveDays = 0;
    }
     if(consecutiveDays > currentStreak) {
        currentStreak = consecutiveDays;
    }


    // Set the final streak based on check up to today
    setStreak(currentStreak);
    setChartData(weekData);

  }, []);

  const totalCalories = chartData.reduce((acc, curr) => acc + curr.calories, 0);
  const totalSteps = chartData.reduce((acc, curr) => acc + curr.steps, 0);
  const points = Math.floor(totalCalories / 10 + totalSteps / 100);
  const [streak, setStreak] = useState(0);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">ملخص الأسبوع</CardTitle>
        <CardDescription>تتبع تقدمك خلال الأسبوع.</CardDescription>
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
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <BarChartIcon className="h-20 w-20" />
            <p className="mt-4 text-sm">لا توجد بيانات متاحة لهذا الأسبوع.</p>
            <p className="text-xs">ابدأ في تسجيل أنشطتك لرؤية تقدمك.</p>
          </div>
        ) : (
          <Tabs defaultValue="calories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calories">السعرات الحرارية</TabsTrigger>
              <TabsTrigger value="steps">الخطوات</TabsTrigger>
            </TabsList>
            <TabsContent value="calories">
              <div className="h-[250px] w-full pt-4">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="steps">
               <div className="h-[250px] w-full pt-4">
                 <ChartContainer config={chartConfig} className="w-full h-full">
                   <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid vertical={false} strokeDasharray="3 3" />
                     <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                     <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                     <ChartTooltip
                       cursor={false}
                       content={<ChartTooltipContent indicator="dot" />}
                     />
                     <Bar dataKey="steps" fill="var(--color-steps)" radius={4} />
                   </BarChart>
                 </ChartContainer>
               </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
