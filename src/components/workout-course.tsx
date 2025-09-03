"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Heart, Combine, PlusCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


interface CourseConfig {
  daysPerWeek: number;
  workoutType: 'strength' | 'cardio' | 'mixed' | '';
}

interface Exercise {
    name: string;
    sets?: number;
    reps?: number;
    duration?: number; // in minutes
}

interface WorkoutDay {
    day: number;
    exercises: Exercise[];
}


function CourseRegistration({ onCourseCreate }: { onCourseCreate: (config: CourseConfig) => void }) {
  const [days, setDays] = useState('');
  const [type, setType] = useState('');

  const handleCreateCourse = () => {
    if (days && type) {
      onCourseCreate({
        daysPerWeek: parseInt(days),
        workoutType: type as CourseConfig['workoutType'],
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-tight">أنشئ كورس التمرين الخاص بك</CardTitle>
        <CardDescription>ابدأ بتحديد أساسيات خطتك التدريبية الأسبوعية.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="days-per-week" className="text-base">كم عدد أيام التمرين في الأسبوع؟</Label>
          <Input
            id="days-per-week"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="مثال: 3"
            className="text-base"
            min="1"
            max="7"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workout-type" className="text-base">ما هو نوع التمرين الأساسي؟</Label>
          <Select onValueChange={setType} value={type}>
            <SelectTrigger id="workout-type" className="text-base h-11">
              <SelectValue placeholder="اختر نوع التمرين..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strength">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <span>تمارين القوة</span>
                </div>
              </SelectItem>
              <SelectItem value="cardio">
                 <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  <span>تمارين الكارديو</span>
                </div>
              </SelectItem>
              <SelectItem value="mixed">
                 <div className="flex items-center gap-2">
                  <Combine className="h-5 w-5 text-secondary-foreground" />
                  <span>مختلط (قوة وكارديو)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full text-lg" onClick={handleCreateCourse} disabled={!days || !type}>
          إنشاء الكورس
        </Button>
      </CardFooter>
    </Card>
  );
}

function WorkoutPlanSetup({ config }: { config: CourseConfig }) {
    const workoutDays = Array.from({ length: config.daysPerWeek }, (_, i) => ({
        day: i + 1,
        exercises: [],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-tight">تخصيص خطة التمرين الخاصة بك</CardTitle>
                <CardDescription>أضف التمارين التي وصفها لك مدربك لكل يوم.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['day-1']} className="w-full">
                    {workoutDays.map(({ day }) => (
                        <AccordionItem value={`day-${day}`} key={day}>
                            <AccordionTrigger className="text-lg font-semibold">
                                يوم التمرين {day}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="text-center text-muted-foreground p-4 border rounded-lg">
                                    <p>لم تتم إضافة تمارين بعد.</p>
                                </div>
                                <Button variant="outline" className="w-full">
                                    <PlusCircle className="ml-2 h-5 w-5" />
                                    إضافة تمرين
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
            <CardFooter>
                 <Button size="lg" className="w-full text-lg">
                    حفظ الكورس
                </Button>
            </CardFooter>
        </Card>
    )
}

export function WorkoutCourse() {
  const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);

  if (courseConfig) {
    return <WorkoutPlanSetup config={courseConfig} />;
  }

  return <CourseRegistration onCourseCreate={setCourseConfig} />;
}
