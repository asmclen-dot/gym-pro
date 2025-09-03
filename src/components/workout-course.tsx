"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Heart, Combine } from 'lucide-react';

// Step 1: Course Registration State
interface CourseConfig {
  daysPerWeek: number;
  workoutType: 'strength' | 'cardio' | 'mixed' | '';
}

export function WorkoutCourse() {
  const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);
  const [days, setDays] = useState('');
  const [type, setType] = useState('');

  const handleCreateCourse = () => {
    if (days && type) {
      setCourseConfig({
        daysPerWeek: parseInt(days),
        workoutType: type as CourseConfig['workoutType'],
      });
    }
  };

  // If a course is already configured, show the dashboard (to be built)
  if (courseConfig) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">كورس التمرين الخاص بك</h2>
        <p>أيام التمرين في الأسبوع: {courseConfig.daysPerWeek}</p>
        <p>نوع التمرين: {courseConfig.workoutType}</p>
        <p className="mt-4 text-muted-foreground">الخطوات التالية: بناء جدول التمرين اليومي وتسجيل الأداء.</p>
      </div>
    );
  }

  // Step 1: Render the course registration form
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
