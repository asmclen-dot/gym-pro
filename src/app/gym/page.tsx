"use client";

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getWorkoutPlanAction, WorkoutPlanState } from '@/app/actions';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CalendarDays, Dumbbell, Star, Repeat, Clock, Coffee, Check, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import Link from 'next/link';

const initialState: WorkoutPlanState = {
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
          جاري إنشاء الخطة...
        </>
      ) : (
        <>
          <Sparkles className="ml-2 h-4 w-4" />
          إنشاء خطة التمرين
        </>
      )}
    </Button>
  );
}


export default function GymPage() {
  const [state, formAction] = useActionState(getWorkoutPlanAction, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "أوه لا! حدث خطأ ما.",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight">جيم الذكاء الاصطناعي</h1>
            <p className="text-muted-foreground mt-2">
              أنشئ خطة تمرين مخصصة لك، وتتبع تقدمك، وحقق أهدافك الصحية.
            </p>
             <Button asChild variant="outline" className="mt-4">
                  <Link href="/">
                    العودة إلى لوحة التحكم
                  </Link>
                </Button>
          </div>

          <Card className="shadow-lg">
            <form action={formAction}>
              <CardHeader>
                <CardTitle>1. إنشاء خطة التمرين الخاصة بك</CardTitle>
                <CardDescription>
                  أخبرنا عن أهدافك وعدد الأيام التي ترغب في التمرين فيها، وسيقوم الذكاء الاصطناعي بتصميم خطة مخصصة لك.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days">كم عدد أيام التمرين في الأسبوع؟</Label>
                    <Input id="days" name="days" type="number" min="1" max="7" placeholder="مثال: 3" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="goals">ما هي أهدافك؟</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      placeholder="مثال: خسارة الوزن وبناء العضلات، زيادة القوة البدنية"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </form>
          </Card>
          
          {state.data && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>2. خطة التمرين المخصصة لك</CardTitle>
                <CardDescription>
                  هذه هي خطتك للأيام القادمة. يمكنك البدء في أي يوم.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {state.data.plan.map((dayPlan) => (
                    <AccordionItem key={dayPlan.day} value={`day-${dayPlan.day}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            {dayPlan.isRestDay ? <Coffee className="h-6 w-6 text-primary" /> : <Dumbbell className="h-6 w-6 text-primary" />}
                            <div className='text-right'>
                                <p className="font-semibold">اليوم {dayPlan.day}</p>
                                <p className={cn("text-sm", dayPlan.isRestDay ? "text-muted-foreground" : "text-primary")}>{dayPlan.title}</p>
                            </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {dayPlan.isRestDay ? (
                            <p className="text-center text-muted-foreground py-4">استمتع بيوم الراحة! الجسم يحتاج إلى التعافي لبناء العضلات.</p>
                        ) : (
                            <div className="space-y-4 pr-4 border-r-2 border-primary/20">
                                {dayPlan.exercises.map((exercise, index) => (
                                    <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-secondary/30">
                                        <div className='flex items-start gap-3'>
                                            <Star className="h-5 w-5 mt-1 text-accent-foreground/50" />
                                            <div>
                                                <p className="font-semibold">{exercise.name}</p>
                                                {exercise.notes && <p className="text-xs text-muted-foreground">{exercise.notes}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-right">
                                            {exercise.sets && (
                                                <div className="flex items-center gap-1">
                                                    <span>{exercise.sets}</span>
                                                    <Repeat className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            {exercise.reps && (
                                                <div className="flex items-center gap-1">
                                                    <span>{exercise.reps}</span>
                                                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                             {exercise.duration && (
                                                <div className="flex items-center gap-1">
                                                    <span>{exercise.duration}</span>
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className='pt-4 text-center'>
                                  <Button>
                                    <Check className='ml-2 h-4 w-4' />
                                    بدء هذا التمرين
                                  </Button>
                                </div>
                            </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

           {/* Placeholder for future steps */}
           <Card className="border-dashed">
             <CardHeader>
               <CardTitle className="text-muted-foreground">3. تتبع تمرينك اليومي</CardTitle>
                <CardDescription>قريباً: ستتمكن من تسجيل الأوزان والسرعات هنا أثناء التمرين.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex justify-center items-center h-24 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">سيتم تفعيل هذه الميزة في الخطوة التالية.</p>
                </div>
             </CardContent>
           </Card>
           <Card className="border-dashed">
             <CardHeader>
               <CardTitle className="text-muted-foreground">4. تتبع سعراتك الحرارية</CardTitle>
                <CardDescription>قريباً: سجّل وجباتك اليومية هنا لحساب السعرات الحرارية التي استهلكتها.</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="flex justify-center items-center h-24 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">سيتم تفعيل هذه الميزة في الخطوة التالية.</p>
                </div>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
