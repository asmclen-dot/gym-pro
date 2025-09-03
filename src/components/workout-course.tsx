
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Heart, Combine, PlusCircle, Trash2, CheckSquare, Edit, BrainCircuit, Droplets, Clock, Weight, Repeat, Flame, Loader2, RefreshCw, PartyPopper, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { generateAIPlanAction, AIPlanState } from '@/app/actions';
import { GenerateWorkoutPlanInput, AIWorkoutDay, AIExercise } from '@/app/types';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { estimateWorkoutCalories, WorkoutCalorieEstimationInput, WorkoutCalorieEstimationOutput } from '@/ai/flows/workout-calorie-estimation';


const exerciseList = [
    // Chest
    "ضغط البنش (Bench Press)", "ضغط البنش المائل (Incline Bench Press)", "ضغط البنش المنحدر (Decline Bench Press)", "ضغط البنش بالدمبل (Dumbbell Bench Press)", "ضغط البنش المائل بالدمبل (Incline Dumbbell Press)", "تفتيح بالدمبل (Dumbbell Flyes)", "تفتيح مائل بالدمبل (Incline Dumbbell Flyes)", "تفتيح بالكابل (Cable Crossover)", "غطس للصدر (Chest Dips)", "ضغط على الأرض (Push-up)", "ضغط على الأرض بقبضة واسعة (Wide-grip Push-up)", "ضغط على الأرض بقبضة ضيقة (Narrow-grip Push-up)", "آلة تفتيح الصدر (Pec-Deck Machine)", "آلة ضغط الصدر (Chest Press Machine)", "ضغط بالبار على آلة سميث (Smith Machine Bench Press)", "ضغط جيلوتين (Guillotine Press)",
    // Back
    "الرفعة الميتة (Deadlift)", "سحب علوي (Pull-up)", "سحب علوي بقبضة واسعة (Wide-grip Pull-up)", "شين أب (Chin-up)", "تجديف بالبار (Barbell Row)", "تجديف بالبار بقبضة معكوسة (Pendlay Row)", "تجديف بالدمبل بذراع واحدة (One-Arm Dumbbell Row)", "سحب أرضي (Seated Cable Row)", "سحب أمامي (Lat Pulldown)", "سحب خلفي (Behind-the-neck Lat Pulldown)", "تمرين التي-بار (T-Bar Row)", "تمرين السوبرمان (Superman)", "تمرين الجسر (Glute Bridge)", "هايبر اكستنشن (Back Extension)", "تجديف مقلوب (Inverted Row)", "سحب أمامي بقبضة ضيقة (Close-grip Lat Pulldown)", "تمرين الوجه بالسحب (Face Pull)", "تمرين Kroc Rows", "تمرين Good Mornings", "تجديف آلة سميث (Smith Machine Row)",
    // Legs
    "سكوات (Squat)", "سكوات أمامي (Front Squat)", "سكوات بلغاري (Bulgarian Split Squat)", "ضغط الأرجل (Leg Press)", "اندفاع (Lunge)", "اندفاع جانبي (Side Lunge)", "رفعة رومانية مميتة (Romanian Deadlift)", "رفعة مميتة بساق واحدة (Single Leg Deadlift)", "تجعيد أوتار الركبة (Hamstring Curl)", "تمديد الساق (Leg Extension)", "رفع السمانة (Calf Raise)", "آلة خطف الفخذ (Hip Abduction Machine)", "آلة ضم الفخذ (Hip Adduction Machine)", "سكوات هاك (Hack Squat)", "سكوات القرفصاء (Goblet Squat)", "خطوات الصندوق (Box Step-ups)", "سكوات Zercher", "سكوات Sissy", "قفزة الصندوق (Box Jump)",
    // Shoulders
    "ضغط الأكتاف (Overhead Press)", "ضغط الأكتاكف بالدمبل (Dumbbell Shoulder Press)", "ضغط أرنولد (Arnold Press)", "رفع جانبي (Lateral Raise)", "رفع أمامي (Front Raise)", "رفع جانبي بالكابل (Cable Lateral Raise)", "تجديف عمودي (Upright Row)", "شراغز بالبار (Barbell Shrugs)", "شراغز بالدمبل (Dumbbell Shrugs)", "فيس بول (Face Pull)", "رفرفة عكسية (Reverse Pec-Deck)", "رفرفة عكسية بالدمبل (Bent-over Dumbbell Reverse Fly)", "بايك بوش أب (Pike Push-up)", "ضغط Landmine", "رفع أمامي بالطبق (Plate Front Raise)", "رفع جانبي منحني (Bent-over Lateral Raise)",
    // Biceps
    "تجعيد العضلة ذات الرأسين بالبار (Barbell Bicep Curl)", "تجعيد العضلة ذات الرأسين بالدمبل (Dumbbell Bicep Curl)", "تجعيد هامر (Hammer Curl)", "تجعيد بريتشر (Preacher Curl)", "تجعيد التركيز (Concentration Curl)", "تجعيد بالكابل (Cable Curl)", "شين أب بقبضة ضيقة (Close-grip Chin-up)", "تجعيد Zottman", "تجعيد العنكبوت (Spider Curl)", "تجعيد عكسي (Reverse Curl)", "تجعيد السحب العالي (High Cable Curl)",
    // Triceps
    "ترايسبس بوشดาวน์ (Tricep Pushdown)", "ترايسبس اكستنشن بالدمبل (Dumbbell Tricep Extension)", "ترايسبس اكستنشن بالكابل (Cable Tricep Extension)", "ضغط البنش بقبضة ضيقة (Close-Grip Bench Press)", "غطس للترايسبس (Tricep Dips)", "تمرين الكيك باك (Tricep Kickback)", "سكال كراشر (Skull Crusher)", "ترايسبس اكستنشن فوق الرأس (Overhead Tricep Extension)", "ضغط JM", "ترايسبس اكستنشن بذراع واحدة (One-arm Tricep Extension)",
    // Core
    "تمرين المعدة (Crunch)", "رفع الساق (Leg Raise)", "بلانك (Plank)", "بلانك جانبي (Side Plank)", "تمرين الدراجة الهوائية (Bicycle Crunch)", "تمرين متسلق الجبال (Mountain Climbers)", "تمرين لمس أصابع القدم (Toe Touches)", "تمرين قاطع الخشب (Woodchoppers)", "تمرين العلم الروسي (Russian Twist)", "تمرين الـ V-up", "تمرين الـ Ab Rollout", "رفع الركبة المعلق (Hanging Knee Raise)", "البلانك المفرغ (Hollow Body Hold)", "تمرين Bird Dog", "تمرين Dead Bug", "تمرين Pallof Press",
    // Cardio
    "جري (Running)", "هرولة (Jogging)", "مشي سريع (Brisk Walking)", "ركوب الدراجة (Cycling)", "ركوب الدراجة الثابتة (Stationary Bike)", "سباحة (Swimming)", "جهاز الإليبتيكال (Elliptical Trainer)", "نط الحبل (Jumping Rope)", "صعود السلالم (Stair Climbing)", "آلة التجديف (Rowing Machine)", "تمارين عالية الكثافة (HIIT)", "بيربيز (Burpees)", "قفز الرافعات (Jumping Jacks)", "صندوق القفز (Box Jumps)", "ضرب الحبال (Battle Ropes)", "كيتل بيل سوينغ (Kettlebell Swings)", "جري سريع (Sprints)", "آلة VersaClimber",
    // Stretching & Flexibility
    "تمدد أوتار الركبة (Hamstring Stretch)", "تمدد عضلات الفخذ الرباعية (Quad Stretch)", "تمدد الصدر (Chest Stretch)", "تمدد الكتف (Shoulder Stretch)", "تمدد الظهر (Cat-Cow Stretch)", "تمدد عضلة الحمامة (Pigeon Pose)", "تمدد الكوبرا (Cobra Pose)", "وضعية الطفل (Child's Pose)", "يوجا (Yoga)", "بيلاتس (Pilates)", "تمدد الفراشة (Butterfly Stretch)", "تمدد الترايسبس (Triceps Stretch)", "لمس أصابع القدمين وقوفاً (Standing Toe Touch)", "تمدد Glute Bridge", "تمدد Figure-Four", "تمدد Bretzel", "تمدد World's Greatest Stretch", "Foam Rolling",
    // Full Body
    "الرفعة الأولمبية (Clean and Jerk)", "خطف (Snatch)", "تمرين Thruster", "تمرين Farmer's Walk", "تمرين Tire Flip", "تمرين Sled Push/Pull", "تمرين Wall Ball", "تمرين Turkish Get-up", "تمرين Man Maker",
    // Abs (additional)
    "تمرين Side Crunch", "تمرين Reverse Crunch", "تمرين Cable Crunch", "تمرين Plank with Hip Dips", "تمرين Flutter Kicks", "تمرين Scissor Kicks", "تمرين Hanging Leg Raise", "تمرين Decline Crunch", "تمرين Abdominal Hold",
    // Calves (additional)
    "رفع السمانة جلوسًا (Seated Calf Raise)", "رفع السمانة على آلة ضغط الأرجل (Leg Press Calf Raise)", "رفع السمانة بذراع واحدة بالدمبل (Single-leg Dumbbell Calf Raise)", "رفع السمانة وقوفًا على آلة سميث (Smith Machine Standing Calf Raise)",
    // Forearms (additional)
    "تجعيد المعصم (Wrist Curl)", "تجعيد المعصم العكسي (Reverse Wrist Curl)", "تمرين Plate Pinch", "تمرين Gripper", "تمرين Behind-the-back Barbell Wrist Curl"
];

interface CourseConfig {
  daysPerWeek: number;
  workoutType: 'strength' | 'cardio' | 'mixed' | '';
}

interface Exercise extends AIExercise {
    actualSets?: number | string;
    actualReps?: number | string;
    actualDuration?: number | string;
    actualWeight?: number | string;
}

interface WorkoutDay extends AIWorkoutDay {
    exercises: Exercise[];
}

interface SavedProgress {
    plan: WorkoutDay[];
    currentDay: number;
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

function WorkoutPlanSetup({ config, existingPlan, onSave, onCancel }: { config: CourseConfig, existingPlan?: WorkoutDay[] | null, onSave: (plan: WorkoutDay[]) => void, onCancel: () => void }) {
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(
        existingPlan || Array.from({ length: config.daysPerWeek }, (_, i) => ({
            day: i + 1,
            targetTime: 'morning',
            exercises: [],
        }))
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ type: 'strength' });
    const [searchTerm, setSearchTerm] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);


    const handleGenerateAIPlan = async () => {
        setIsGenerating(true);
        const result: AIPlanState = await generateAIPlanAction({
            daysPerWeek: config.daysPerWeek,
            workoutType: config.workoutType as 'strength' | 'cardio' | 'mixed'
        });
        if (result.data?.plan) {
            setWorkoutDays(result.data.plan.map(day => ({...day, exercises: day.exercises.map(ex => ({...ex, done: false})) })));
        } else {
            // Handle error, maybe show a toast
            console.error(result.error);
        }
        setIsGenerating(false);
    };

    const filteredExercises = useMemo(() =>
        searchTerm
            ? exerciseList.filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10) // Limit results
            : [],
        [searchTerm]
    );

    const openAddExerciseDialog = (day: number) => {
        setSelectedDay(day);
        setNewExercise({ type: config.workoutType === 'cardio' ? 'cardio' : 'strength' });
        setSearchTerm("");
        setIsDialogOpen(true);
    };

    const handleAddExercise = () => {
        if (!selectedDay || !newExercise.name || !newExercise.type) return;

        const finalExercise: Exercise = {
            id: crypto.randomUUID(),
            name: newExercise.name,
            type: newExercise.type,
            targetSets: newExercise.type === 'strength' ? Number(newExercise.targetSets || 3) : undefined,
            targetReps: newExercise.type === 'strength' ? Number(newExercise.targetReps || 12) : undefined,
            targetDuration: newExercise.type === 'cardio' || newExercise.type === 'flexibility' ? Number(newExercise.targetDuration || 15) : undefined,
            targetWeight: newExercise.type === 'strength' ? Number(newExercise.targetWeight || 10) : undefined,
            done: false,
        };

        setWorkoutDays(currentDays =>
            currentDays.map(day =>
                day.day === selectedDay
                    ? { ...day, exercises: [...day.exercises, finalExercise] }
                    : day
            )
        );
        setIsDialogOpen(false);
    };

    const handleRemoveExercise = (dayNumber: number, exerciseId: string) => {
        setWorkoutDays(currentDays =>
            currentDays.map(day =>
                day.day === dayNumber
                    ? { ...day, exercises: day.exercises.filter((ex) => ex.id !== exerciseId) }
                    : day
            )
        );
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setNewExercise({ ...newExercise, name: e.target.value });
        setIsPopoverOpen(!!e.target.value);
    }

    const handleSelectExercise = (exerciseName: string) => {
        setSearchTerm(exerciseName);
        setNewExercise({ ...newExercise, name: exerciseName });
        setIsPopoverOpen(false);
    }
    
    const handleTargetTimeChange = (dayNumber: number, time: AIWorkoutDay['targetTime']) => {
        setWorkoutDays(currentDays =>
            currentDays.map(day =>
                day.day === dayNumber
                    ? { ...day, targetTime: time }
                    : day
            )
        );
    };


    const isPlanEmpty = workoutDays.every(day => day.exercises.length === 0);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-tight">تخصيص خطة التمرين الخاصة بك</CardTitle>
                    <CardDescription>أضف التمارين يدويًا أو دع الذكاء الاصطناعي ينشئ لك خطة.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="mb-4">
                        <Button onClick={handleGenerateAIPlan} disabled={isGenerating} className="w-full">
                            {isGenerating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="ml-2 h-5 w-5" />}
                            {isGenerating ? 'جارٍ إنشاء الخطة...' : 'إنشاء خطة بواسطة الذكاء الاصطناعي'}
                        </Button>
                    </div>
                    <Accordion type="multiple" defaultValue={['day-1']} className="w-full">
                        {workoutDays.map(({ day, exercises, targetTime }) => (
                            <AccordionItem value={`day-${day}`} key={day}>
                                <AccordionTrigger className="text-lg font-semibold">
                                    <div className='flex items-center justify-between w-full pr-2'>
                                        <span>يوم التمرين {day}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                     <div className="space-y-2 max-w-[200px]">
                                        <Label>وقت التمرين</Label>
                                        <Select onValueChange={(value) => handleTargetTimeChange(day, value as AIWorkoutDay['targetTime'])} value={targetTime || undefined}>
                                            <SelectTrigger className="h-9 text-sm">
                                                <SelectValue placeholder="حدد الوقت" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="morning">صباحًا</SelectItem>
                                                <SelectItem value="afternoon">ظهرًا</SelectItem>
                                                <SelectItem value="evening">مساءً</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {exercises.length === 0 ? (
                                        <div className="text-center text-muted-foreground p-4 border rounded-lg">
                                            <p>لم تتم إضافة تمارين بعد.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {exercises.map((ex) => (
                                                 <div key={ex.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                                                    <div className='flex items-center gap-3'>
                                                        <div className={cn("p-2 rounded-full", 
                                                          ex.type === 'strength' ? 'bg-primary/20' : 
                                                          ex.type === 'cardio' ? 'bg-destructive/20' : 'bg-accent/80'
                                                        )}>
                                                            {ex.type === 'strength' && <Dumbbell className="h-5 w-5 text-primary" />}
                                                            {ex.type === 'cardio' && <Heart className="h-5 w-5 text-destructive" />}
                                                            {ex.type === 'flexibility' && <Droplets className="h-5 w-5 text-accent-foreground" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{ex.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {ex.type === 'strength' && `الهدف: ${ex.targetSets} مجموعات × ${ex.targetReps} عدات @ ${ex.targetWeight}كغ`}
                                                                {(ex.type === 'cardio' || ex.type === 'flexibility') && `الهدف: ${ex.targetDuration} دقيقة`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveExercise(day, ex.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full" onClick={() => openAddExerciseDialog(day)}>
                                        <PlusCircle className="ml-2 h-5 w-5" />
                                        إضافة تمرين يدويًا
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row gap-2">
                    <Button size="lg" className="w-full text-lg" onClick={() => onSave(workoutDays)} disabled={isPlanEmpty || isGenerating}>
                        <CheckSquare className='ml-2 h-5 w-5'/>
                        حفظ الكورس
                    </Button>
                     {existingPlan && (
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={onCancel}>
                            إلغاء
                        </Button>
                     )}
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>إضافة تمرين جديد لليوم {selectedDay}</DialogTitle>
                        <DialogDescription>
                            ابحث عن تمرين أو أدخل اسمًا جديدًا وحدد تفاصيله.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="space-y-2">
                                    <Label htmlFor="exercise-name">اسم التمرين</Label>
                                    <Input
                                        id="exercise-name"
                                        value={newExercise.name || ''}
                                        onChange={handleSearchChange}
                                        placeholder="اكتب للبحث عن تمرين..."
                                        autoComplete="off"
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                {filteredExercises.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredExercises.map((ex) => (
                                            <div
                                                key={ex}
                                                onClick={() => handleSelectExercise(ex)}
                                                className="p-2 hover:bg-accent cursor-pointer text-sm"
                                            >
                                                {ex}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                        {searchTerm ? "لم يتم العثور على تمارين. يمكنك إضافته." : "ابدأ الكتابة للبحث..."}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        <div className="space-y-2">
                             <Label htmlFor="exercise-type">نوع التمرين</Label>
                             <Select
                                value={newExercise.type}
                                onValueChange={(value: Exercise['type']) => setNewExercise({ ...newExercise, type: value })}
                            >
                                <SelectTrigger id="exercise-type">
                                    <SelectValue placeholder="اختر النوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="strength">قوة</SelectItem>
                                    <SelectItem value="cardio">كارديو</SelectItem>
                                    <SelectItem value="flexibility">مرونة وتمدد</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {newExercise.type === 'strength' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="weight">الوزن المستهدف (كغ)</Label>
                                    <Input id="weight" type="number" value={newExercise.targetWeight || ''} onChange={(e) => setNewExercise({ ...newExercise, targetWeight: parseInt(e.target.value) })} placeholder="10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sets">المجموعات المستهدفة</Label>
                                    <Input id="sets" type="number" value={newExercise.targetSets || ''} onChange={(e) => setNewExercise({ ...newExercise, targetSets: parseInt(e.target.value) })} placeholder="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reps">العدات المستهدفة</Label>
                                    <Input id="reps" type="number" value={newExercise.targetReps || ''} onChange={(e) => setNewExercise({ ...newExercise, targetReps: parseInt(e.target.value) })} placeholder="12" />
                                </div>
                            </div>
                        )}
                        {(newExercise.type === 'cardio' || newExercise.type === 'flexibility') && (
                             <div className="space-y-2">
                                <Label htmlFor="duration">المدة المستهدفة (بالدقائق)</Label>
                                <Input id="duration" type="number" value={newExercise.targetDuration || ''} onChange={(e) => setNewExercise({ ...newExercise, targetDuration: parseInt(e.target.value) })} placeholder="30" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">إلغاء</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleAddExercise}>إضافة</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

function WorkoutDayDisplay({ day, onPerformanceChange, onComplete, isLoading }: { day: WorkoutDay, onPerformanceChange: (exerciseId: string, field: keyof Exercise, value: string | number | boolean) => void, onComplete: () => void, isLoading: boolean }) {
    const allExercisesDone = day.exercises.length > 0 && day.exercises.every(ex => ex.done);

    return (
        <CardContent className="space-y-4 pt-4">
            {day.targetTime && <div className='text-sm font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md max-w-fit'>{day.targetTime === 'morning' ? 'صباحًا' : day.targetTime === 'afternoon' ? 'ظهرًا' : 'مساءً'}</div>}
            {day.exercises.length === 0 ? (
                <div className="text-center text-muted-foreground p-4 border rounded-lg">
                    <p>لا توجد تمارين لهذا اليوم.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {day.exercises.map((ex) => (
                         <div key={ex.id} className="flex flex-col p-3 rounded-lg bg-secondary/50 gap-3">
                            <div className="flex items-start justify-between">
                                <div className='flex items-center gap-3'>
                                     <div className={cn("p-2 rounded-full", 
                                      ex.type === 'strength' ? 'bg-primary/20' : 
                                      ex.type === 'cardio' ? 'bg-destructive/20' : 'bg-accent/80'
                                    )}>
                                        {ex.type === 'strength' && <Dumbbell className="h-5 w-5 text-primary" />}
                                        {ex.type === 'cardio' && <Heart className="h-5 w-5 text-destructive" />}
                                        {ex.type === 'flexibility' && <Droplets className="h-5 w-5 text-accent-foreground" />}
                                    </div>
                                    <div>
                                        <p className="font-bold">{ex.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {ex.type === 'strength' && `الهدف: ${ex.targetSets || 0} مجموعات × ${ex.targetReps || 0} عدات @ ${ex.targetWeight || 0}كغ`}
                                            {(ex.type === 'cardio' || ex.type === 'flexibility') && `الهدف: ${ex.targetDuration || 0} دقيقة`}
                                        </p>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Label htmlFor={`ex-done-${ex.id}`} className='cursor-pointer text-sm font-semibold'>تم</Label>
                                    <input type='checkbox' id={`ex-done-${ex.id}`} className='h-5 w-5 accent-primary' 
                                      checked={!!ex.done}
                                      onChange={(e) => onPerformanceChange(ex.id, 'done', e.target.checked)}
                                    />
                                </div>
                            </div>
                            {/* Daily Performance Logging */}
                            <div className='flex flex-wrap items-center gap-2 pl-12'>
                                <p className='text-sm font-semibold'>الأداء الفعلي:</p>
                                {ex.type === 'strength' && (
                                    <>
                                        <Weight className="h-4 w-4 text-muted-foreground" />
                                        <Input type='number' placeholder={`${ex.targetWeight || 0} كغ`} className='h-8 w-24 text-sm'
                                          value={ex.actualWeight || ''}
                                          onChange={(e) => onPerformanceChange(ex.id, 'actualWeight', e.target.value)} />
                                        <Repeat className="h-4 w-4 text-muted-foreground" />
                                         <Input type='number' placeholder={`${ex.targetSets || 0}`} className='h-8 w-16 text-sm'
                                          value={ex.actualSets || ''}
                                          onChange={(e) => onPerformanceChange(ex.id, 'actualSets', e.target.value)} />
                                        <span className='text-muted-foreground'>x</span>
                                        <Input type='number' placeholder={`${ex.targetReps || 0}`} className='h-8 w-16 text-sm'
                                          value={ex.actualReps || ''}
                                          onChange={(e) => onPerformanceChange(ex.id, 'actualReps', e.target.value)} />
                                    </>
                                )}
                                {(ex.type === 'cardio' || ex.type === 'flexibility') && (
                                     <>
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <Input type='number' placeholder={`${ex.targetDuration || 0} دقيقة`} className='h-8 w-28 text-sm'
                                          value={ex.actualDuration || ''}
                                          onChange={(e) => onPerformanceChange(ex.id, 'actualDuration', e.target.value)} />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className='flex justify-between items-center pt-4'>
                         <Button onClick={onComplete} disabled={isLoading || !allExercisesDone}>
                            {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className='ml-2 h-4 w-4'/>}
                            {isLoading ? 'جارٍ الحفظ...' : 'إكمال اليوم'}
                        </Button>
                    </div>
                </div>
            )}
        </CardContent>
    );
}

function WorkoutPlanDisplay({ progress, onProgressChange, onEdit, onReset }: { progress: SavedProgress, onProgressChange: (newProgress: SavedProgress) => void, onEdit: () => void, onReset: () => void }) {
    const { plan, currentDay } = progress;
    const [isLoading, setIsLoading] = useState(false);
    const [caloriesResult, setCaloriesResult] = useState<number | null>(null);
    const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

    const activeDayData = plan.find(d => d.day === currentDay);
    const isCourseFinished = !activeDayData;

    const handlePerformanceChange = (exerciseId: string, field: keyof Exercise, value: string | number | boolean) => {
        const updatedPlan = plan.map(day => {
            if (day.day === currentDay) {
                return {
                    ...day,
                    exercises: day.exercises.map(ex =>
                        ex.id === exerciseId ? { ...ex, [field]: value } : ex
                    )
                };
            }
            return day;
        });
        onProgressChange({ ...progress, plan: updatedPlan });
    };

    const getNumericValue = (value: string | number | undefined | null): number | undefined => {
        if (value === undefined || value === null || value === '') return undefined;
        const num = Number(value);
        return isNaN(num) || num <= 0 ? undefined : num;
    };
    
    const handleCompleteDay = async () => {
        if (!activeDayData) return;
        setIsLoading(true);

        const exercisesToCalculate: WorkoutCalorieEstimationInput['exercises'] = activeDayData.exercises
            .map(e => {
                const exerciseData: any = { name: e.name, type: e.type };
                
                const duration = getNumericValue(e.actualDuration) ?? getNumericValue(e.targetDuration);
                const sets = getNumericValue(e.actualSets) ?? getNumericValue(e.targetSets);
                const reps = getNumericValue(e.actualReps) ?? getNumericValue(e.targetReps);
                const weight = getNumericValue(e.actualWeight) ?? getNumericValue(e.targetWeight);

                if (e.type !== 'strength') {
                    if (duration) exerciseData.durationInMinutes = duration;
                } else {
                    if (sets) exerciseData.sets = sets;
                    if (reps) exerciseData.reps = reps;
                    if (weight) exerciseData.weight = weight;
                }
                // Only return if there is some metric to calculate
                return (exerciseData.durationInMinutes || (exerciseData.sets && exerciseData.reps)) ? exerciseData : null;
            })
            .filter((e): e is NonNullable<typeof e> => e !== null);


        let calculatedCalories = 0;
        if (exercisesToCalculate.length > 0) {
            const result: WorkoutCalorieEstimationOutput = await estimateWorkoutCalories({ exercises: exercisesToCalculate });
            
            if (result.estimatedCalories) {
                calculatedCalories = result.estimatedCalories;
            } else {
                console.error("Failed to calculate calories:", result);
            }
        }
        
        setCaloriesResult(calculatedCalories);
        setIsLoading(false);
        setIsResultDialogOpen(true);
    };

    const handleConfirmAndProceed = () => {
         if (caloriesResult !== null) {
            const today = format(new Date(), 'yyyy-MM-dd');
            try {
                const dayStorage = JSON.parse(localStorage.getItem(today) || '{}');
                const existingCalories = dayStorage.workoutCalories || 0;
                dayStorage.workoutCalories = existingCalories + caloriesResult;
                localStorage.setItem(today, JSON.stringify(dayStorage));
            } catch (error) {
                localStorage.setItem(today, JSON.stringify({ workoutCalories: caloriesResult }));
            }
        }
        
        // Move to next day
        onProgressChange({ ...progress, currentDay: currentDay + 1 });
        setCaloriesResult(null);
        setIsResultDialogOpen(false);
    }

    if (isCourseFinished) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-tight">تهانينا!</CardTitle>
                    <CardDescription>لقد أكملت جميع أيام الكورس بنجاح.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col items-center justify-center text-center gap-4 py-10'>
                    <PartyPopper className='h-20 w-20 text-primary animate-pulse' />
                    <p className='text-lg font-semibold'>لقد قمت بعمل رائع! استمر في التقدم.</p>
                    <Button onClick={onReset} size='lg'>
                        <RefreshCw className='ml-2 h-5 w-5' />
                        بدء كورس جديد
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader className='flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <CardTitle className="font-headline text-2xl tracking-tight">يوم التمرين {currentDay} من {plan.length}</CardTitle>
                        <CardDescription>هذا هو تركيزك لليوم. بالتوفيق!</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={onEdit}>
                            <Edit className='h-5 w-5' />
                            <span className='sr-only'>تعديل الكورس</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={onReset}>
                            <RefreshCw className='h-5 w-5' />
                            <span className='sr-only'>إعادة تعيين الكورس</span>
                        </Button>
                    </div>
                </CardHeader>
                {activeDayData && <WorkoutDayDisplay day={activeDayData} onPerformanceChange={handlePerformanceChange} onComplete={handleCompleteDay} isLoading={isLoading} />}
            </Card>
            
            <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>أحسنت! لقد أكملت تمرين اليوم!</DialogTitle>
                        <DialogDescription>
                            هذا هو تقدير السعرات الحرارية التي حرقتها في هذا التمرين.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center gap-4 py-8">
                        <Flame className="h-16 w-16 text-primary" />
                        <div>
                            <p className="text-muted-foreground">السعرات الحرارية المحروقة</p>
                            <p className="text-5xl font-bold font-mono text-primary">{caloriesResult ?? 0}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" className="w-full" onClick={handleConfirmAndProceed}>
                             رائع! انتقل لليوم التالي
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function LoadingSkeleton() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
    )
}

export function WorkoutCourse() {
    const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);
    const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem('workoutProgress');
            if (storedProgress) {
                setSavedProgress(JSON.parse(storedProgress));
            }
        } catch (error) {
            console.error("Failed to parse workout progress from localStorage", error);
            localStorage.removeItem('workoutProgress');
        }
        setIsLoading(false);
    }, []);
    
    const handleSavePlan = (plan: WorkoutDay[]) => {
        const planWithDoneStatus = plan.map(day => ({
            ...day,
            exercises: day.exercises.map(ex => ({ ...ex, done: false, actualSets: '', actualReps: '', actualDuration: '', actualWeight: '' }))
        }));
        const newProgress: SavedProgress = { plan: planWithDoneStatus, currentDay: 1 };
        localStorage.setItem('workoutProgress', JSON.stringify(newProgress));
        setSavedProgress(newProgress);
        setCourseConfig(null);
    };

    const handleProgressChange = (newProgress: SavedProgress) => {
        localStorage.setItem('workoutProgress', JSON.stringify(newProgress));
        setSavedProgress(newProgress);
    }
    
    const handleEditPlan = () => {
        if (savedProgress) {
            const { plan } = savedProgress;
            const hasStrength = plan.some(d => d.exercises.some(e => e.type === 'strength'));
            const hasCardio = plan.some(d => d.exercises.some(e => e.type === 'cardio'));
            let workoutType: CourseConfig['workoutType'] = 'mixed';
            if (hasStrength && !hasCardio) workoutType = 'strength';
            if (!hasStrength && hasCardio) workoutType = 'cardio';

            setCourseConfig({
                daysPerWeek: plan.length,
                workoutType: workoutType,
            });
        }
    };
    
    const handleResetPlan = () => {
        localStorage.removeItem('workoutProgress');
        setSavedProgress(null);
        setCourseConfig(null);
    };

    const handleCancelEdit = () => {
        setCourseConfig(null);
    }
    
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (savedProgress && !courseConfig) {
        return <WorkoutPlanDisplay progress={savedProgress} onProgressChange={handleProgressChange} onEdit={handleEditPlan} onReset={handleResetPlan} />;
    }

    if (courseConfig) {
        return <WorkoutPlanSetup config={courseConfig} existingPlan={savedProgress?.plan} onSave={handleSavePlan} onCancel={handleCancelEdit} />;
    }

    return <CourseRegistration onCourseCreate={setCourseConfig} />;
}
