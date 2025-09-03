"use client";

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getWorkoutCaloriesAction, WorkoutState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: WorkoutState = {
  data: null,
  error: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
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

  return (
    <Card className="shadow-sm">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline tracking-tight">تقدير السعرات الحرارية للتمرين</CardTitle>
          <CardDescription>استخدم الذكاء الاصطناعي لتقدير حرق السعرات الحرارية لتمرينك.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="exerciseName">اسم التمرين</Label>
            <Input
              id="exerciseName"
              name="exerciseName"
              placeholder="مثال: الجري، رفع الأثقال"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationInMinutes">المدة (بالدقائق)</Label>
            <Input
              id="durationInMinutes"
              name="durationInMinutes"
              type="number"
              placeholder="مثال: 30"
              required
            />
          </div>
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
                <p className="text-sm text-muted-foreground">
                    تمرين <strong>{state.input?.exerciseName}</strong> لمدة <strong>{state.input?.durationInMinutes}</strong> دقيقة يحرق حوالي:
                </p>
                <p className="text-3xl font-bold font-mono text-primary">{state.data.estimatedCalories} <span className="text-lg">سعر حراري</span></p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
