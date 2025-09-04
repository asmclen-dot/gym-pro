"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Footprints, Target, Zap, BarChart as BarChartIcon, Utensils } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from 'date-fns';
import { arSA } from 'date-fns/locale';


const chartConfig = {
  gained: {
    label: "المكتسبة",
    color: "hsl(var(--primary))",
  },
  burned: {
    label: "المحروقة",
    color: "hsl(var(--destructive))",
  },
  steps: {
    label: "الخطوات",
    color: "hsl(var(--accent-foreground))",
  },
}

interface DailyData {
    date: string;
    gained: number; // Calories gained from food
    burned: number; // Calories burned from workout
    steps: number;
}


export function Stats() {
  const [chartData, setChartData] = useState<DailyData[]>([]);
  const [streak, setStreak] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // This effect runs only on the client side
    const today = new Date();
    const weekData: DailyData[] = [];
    let consecutiveDays = 0;
    let currentStreak = 0;

    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        let foodCalories = 0;
        let workoutCalories = 0;
        let steps = 0;
        
        try {
          const storedData = localStorage.getItem(dateString);
          if (storedData) {
              const parsedData = JSON.parse(storedData);
              foodCalories = parsedData.foods?.reduce((acc: number, food: any) => acc + food.calories, 0) || 0;
              workoutCalories = parsedData.workoutCalories || 0;
              steps = parsedData.steps || 0;

              if (foodCalories > 0 || workoutCalories > 0 || steps > 0) {
                consecutiveDays++;
              } else {
                consecutiveDays = 0;
              }
          } else {
            consecutiveDays = 0;
          }
        } catch (error) {
            console.error("Failed to parse data for", dateString, error);
            consecutiveDays = 0;
        }
        
        if(consecutiveDays > currentStreak) {
            currentStreak = consecutiveDays;
        }

        weekData.push({
            date: format(date, 'eeee', { locale: arSA }), // 'الأحد', 'الاثنين', etc.
            gained: foodCalories,
            burned: workoutCalories,
            steps: steps,
        });
    }

    const todayString = format(today, 'yyyy-MM-dd');
    let todayHasActivity = false;
    try {
        const storedToday = localStorage.getItem(todayString);
        if(storedToday) {
            const parsedData = JSON.parse(storedToday);
            todayHasActivity = (parsedData.foods?.length > 0) || (parsedData.workoutCalories > 0) || (parsedData.steps > 0);
        }
    } catch (e) {}

    if (!todayHasActivity) {
      // If today has no activity, the streak from yesterday is the final one
      // The loop already calculated this, but if the last day had activity, we need to correct
      // This logic is tricky. Let's simplify: the streak is the count of past consecutive days WITH today
      // If today has no activity, the streak is broken for today.
      const lastDayInLoop = weekData[weekData.length - 1];
      if (lastDayInLoop.gained > 0 || lastDayInLoop.burned > 0 || lastDayInLoop.steps > 0) {
         // streak is correct
      }
    } else {
       if(consecutiveDays > currentStreak) {
          currentStreak = consecutiveDays;
      }
    }


    // Set the final streak based on check up to today
    setStreak(currentStreak);
    setChartData(weekData);

  }, []);
  
  if (!isClient) {
      return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline tracking-tight">ملخص الأسبوع</CardTitle>
                <CardDescription>تتبع تقدمك خلال الأسبوع.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <BarChartIcon className="h-20 w-20" />
                    <p className="mt-4 text-sm">جاري تحميل البيانات...</p>
                </div>
            </CardContent>
        </Card>
      )
  }

  const totalCaloriesGained = chartData.reduce((acc, curr) => acc + curr.gained, 0);
  const totalCaloriesBurned = chartData.reduce((acc, curr) => acc + curr.burned, 0);
  const totalSteps = chartData.reduce((acc, curr) => acc + curr.steps, 0);
  const points = Math.floor((totalCaloriesBurned) / 10 + totalSteps / 100);

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
                <Utensils className="size-5 text-primary" />
                <span className="font-semibold">السعرات المكتسبة</span>
              </div>
              <span className="text-2xl font-bold font-mono">{totalCaloriesGained.toLocaleString()}</span>
            </div>
             <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="size-5 text-destructive" />
                <span className="font-semibold">السعرات المحروقة</span>
              </div>
              <span className="text-2xl font-bold font-mono">{totalCaloriesBurned.toLocaleString()}</span>
            </div>
             <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-5" />
                <span className="font-semibold">النقاط المكتسبة</span>
              </div>
              <span className="text-2xl font-bold font-mono">{points.toLocaleString()}</span>
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
                    <Bar dataKey="gained" fill="var(--color-gained)" radius={4} />
                    <Bar dataKey="burned" fill="var(--color-burned)" radius={4} />
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
