"use client";

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getWorkoutCaloriesAction, WorkoutState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Flame, Clock, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const initialState: WorkoutState = {
  data: null,
  error: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          جارٍ الحساب...
        </>
      ) : (
        <>
          <Sparkles className="ml-2 h-4 w-4" />
          حساب السعرات
        </>
      )}
    </Button>
  );
}

export function AIWorkoutPlanner() {
  const [state, formAction] = useActionState(getWorkoutCaloriesAction, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "أوه لا! حدث خطأ ما.",
        description: state.error,
      })
    }
  }, [state.error, toast]);

  const renderResultText = () => {
    if (!state.input) return null;

    if (Array.isArray(state.input.exercises) && state.input.exercises.length > 0) {
      return (
        <p className="text-sm text-muted-foreground">
            إجمالي السعرات الحرارية المحروقة لهذا اليوم يقدر بـ:
        </p>
      );
    }
    
    const { exerciseName, durationInMinutes, sets, reps } = state.input;
    
    if (durationInMinutes) {
      return (
        <p className="text-sm text-muted-foreground">
            تمرين <strong>{exerciseName}</strong> لمدة <strong>{durationInMinutes}</strong> دقيقة يحرق حوالي:
        </p>
      );
    }
    
    if (sets && reps) {
      return (
        <p className="text-sm text-muted-foreground">
          تمرين <strong>{exerciseName}</strong> لـ <strong>{sets}</strong> مجموعات وكل مجموعة <strong>{reps}</strong> عدات يحرق حوالي:
        </p>
      );
    }
    
    return null;
  }

  return (
    <Card className="shadow-sm">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline tracking-tight">تقدير السعرات الحرارية للتمرين</CardTitle>
          <CardDescription>استخدم الذكاء الاصطناعي لتقدير حرق السعرات الحرارية لتمرينك.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="time" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="time">
                <Clock className="ml-2 h-4 w-4" />
                بالوقت
              </TabsTrigger>
              <TabsTrigger value="reps">
                <Repeat className="ml-2 h-4 w-4" />
                بالعدات
              </TabsTrigger>
            </TabsList>
            <div className="space-y-2 mt-4">
              <Label htmlFor="exerciseName">اسم التمرين</Label>
              <Input
                id="exerciseName"
                name="exerciseName"
                placeholder="مثال: الجري، ضغط البنش"
                required
              />
            </div>
            <TabsContent value="time" className="mt-4">
              <input type="hidden" name="type" value="time" />
              <div className="space-y-2">
                <Label htmlFor="durationInMinutes">المدة (بالدقائق)</Label>
                <Input
                  id="durationInMinutes"
                  name="durationInMinutes"
                  type="number"
                  placeholder="مثال: 30"
                />
              </div>
            </TabsContent>
            <TabsContent value="reps" className="mt-4">
              <input type="hidden" name="type" value="reps" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">المجموعات (Sets)</Label>
                  <Input
                    id="sets"
                    name="sets"
                    type="number"
                    placeholder="مثال: 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">العدات (Reps)</Label>
                  <Input
                    id="reps"
                    name="reps"
                    type="number"
                    placeholder="مثال: 12"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>

      {state.data && (
        <CardContent className="border-t pt-6 mt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Flame className="h-8 w-8 text-primary" />
            </div>
            <div className='text-right'>
                {renderResultText()}
                <p className="text-3xl font-bold font-mono text-primary">{state.data.estimatedCalories} <span className="text-lg">سعر حراري</span></p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
