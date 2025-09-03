"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Heart, Combine, PlusCircle, Trash2, CheckSquare, Edit } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const exerciseList = [
    // Chest
    "ضغط البنش (Bench Press)", "ضغط البنش المائل (Incline Bench Press)", "ضغط البنش المنحدر (Decline Bench Press)", "ضغط البنش بالدمبل (Dumbbell Bench Press)", "ضغط البنش المائل بالدمبل (Incline Dumbbell Press)", "تفتيح بالدمبل (Dumbbell Flyes)", "تفتيح مائل بالدمبل (Incline Dumbbell Flyes)", "تفتيح بالكابل (Cable Crossover)", "غطس للصدر (Chest Dips)", "ضغط على الأرض (Push-up)", "ضغط على الأرض بقبضة واسعة (Wide-grip Push-up)", "ضغط على الأرض بقبضة ضيقة (Narrow-grip Push-up)", "آلة تفتيح الصدر (Pec-Deck Machine)", "آلة ضغط الصدر (Chest Press Machine)",
    // Back
    "الرفعة الميتة (Deadlift)", "سحب علوي (Pull-up)", "سحب علوي بقبضة واسعة (Wide-grip Pull-up)", "شين أب (Chin-up)", "تجديف بالبار (Barbell Row)", "تجديف بالبار بقبضة معكوسة (Pendlay Row)", "تجديف بالدمبل بذراع واحدة (One-Arm Dumbbell Row)", "سحب أرضي (Seated Cable Row)", "سحب أمامي (Lat Pulldown)", "سحب خلفي (Behind-the-neck Lat Pulldown)", "تمرين التي-بار (T-Bar Row)", "تمرين السوبرمان (Superman)", "تمرين الجسر (Glute Bridge)", "هايبر اكستنشن (Back Extension)",
    // Legs
    "سكوات (Squat)", "سكوات أمامي (Front Squat)", "سكوات بلغاري (Bulgarian Split Squat)", "ضغط الأرجل (Leg Press)", "اندفاع (Lunge)", "اندفاع جانبي (Side Lunge)", "رفعة رومانية مميتة (Romanian Deadlift)", "رفعة مميتة بساق واحدة (Single Leg Deadlift)", "تجعيد أوتار الركبة (Hamstring Curl)", "تمديد الساق (Leg Extension)", "رفع السمانة (Calf Raise)", "آلة خطف الفخذ (Hip Abduction Machine)", "آلة ضم الفخذ (Hip Adduction Machine)", "سكوات هاك (Hack Squat)",
    // Shoulders
    "ضغط الأكتاف (Overhead Press)", "ضغط الأكتاف بالدمبل (Dumbbell Shoulder Press)", "ضغط أرنولد (Arnold Press)", "رفع جانبي (Lateral Raise)", "رفع أمامي (Front Raise)", "رفع جانبي بالكابل (Cable Lateral Raise)", "تجديف عمودي (Upright Row)", "شراغز بالبار (Barbell Shrugs)", "شراغز بالدمبل (Dumbbell Shrugs)", "فيس بول (Face Pull)", "رفرفة عكسية (Reverse Pec-Deck)",
    // Biceps
    "تجعيد العضلة ذات الرأسين بالبار (Barbell Bicep Curl)", "تجعيد العضلة ذات الرأسين بالدمبل (Dumbbell Bicep Curl)", "تجعيد هامر (Hammer Curl)", "تجعيد بريتشر (Preacher Curl)", "تجعيد التركيز (Concentration Curl)", "تجعيد بالكابل (Cable Curl)", "شين أب بقبضة ضيقة (Close-grip Chin-up)",
    // Triceps
    "ترايسبس بوشดาวน์ (Tricep Pushdown)", "ترايسبس اكستنشن بالدمبل (Dumbbell Tricep Extension)", "ترايسبس اكستنشن بالكابل (Cable Tricep Extension)", "ضغط البنش بقبضة ضيقة (Close-Grip Bench Press)", "غطس للترايسبس (Tricep Dips)", "تمرين الكيك باك (Tricep Kickback)", "سكال كراشر (Skull Crusher)",
    // Core
    "تمرين المعدة (Crunch)", "رفع الساق (Leg Raise)", "بلانك (Plank)", "بلانك جانبي (Side Plank)", "تمرين الدراجة الهوائية (Bicycle Crunch)", "تمرين متسلق الجبال (Mountain Climbers)", "تمرين لمس أصابع القدم (Toe Touches)", "تمرين قاطع الخشب (Woodchoppers)", "تمرين العلم الروسي (Russian Twist)", "تمرين الـ V-up", "تمرين الـ Ab Rollout",
    // Cardio
    "جري (Running)", "هرولة (Jogging)", "مشي سريع (Brisk Walking)", "ركوب الدراجة (Cycling)", "ركوب الدراجة الثابتة (Stationary Bike)", "سباحة (Swimming)", "جهاز الإليبتيكال (Elliptical Trainer)", "نط الحبل (Jumping Rope)", "صعود السلالم (Stair Climbing)", "آلة التجديف (Rowing Machine)", "تمارين عالية الكثافة (HIIT)", "بيربيز (Burpees)", "قفز الرافعات (Jumping Jacks)", "صندوق القفز (Box Jumps)", "ضرب الحبال (Battle Ropes)",
    // Stretching & Flexibility
    "تمدد أوتار الركبة (Hamstring Stretch)", "تمدد عضلات الفخذ الرباعية (Quad Stretch)", "تمدد الصدر (Chest Stretch)", "تمدد الكتف (Shoulder Stretch)", "تمدد الظهر (Cat-Cow Stretch)", "تمدد عضلة الحمامة (Pigeon Pose)", "تمدد الكوبرا (Cobra Pose)", "وضعية الطفل (Child's Pose)", "يوجا (Yoga)", "بيلاتس (Pilates)"
];

interface CourseConfig {
  daysPerWeek: number;
  workoutType: 'strength' | 'cardio' | 'mixed' | '';
}

interface Exercise {
    name: string;
    type: 'strength' | 'cardio';
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

function WorkoutPlanSetup({ config, onSave }: { config: CourseConfig, onSave: (plan: WorkoutDay[]) => void }) {
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(
        Array.from({ length: config.daysPerWeek }, (_, i) => ({
            day: i + 1,
            exercises: [],
        }))
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ type: 'strength' });
    const [searchTerm, setSearchTerm] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const filteredExercises = useMemo(() =>
        searchTerm
            ? exerciseList.filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase()))
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
            name: newExercise.name,
            type: newExercise.type,
            sets: newExercise.type === 'strength' ? Number(newExercise.sets || 0) : undefined,
            reps: newExercise.type === 'strength' ? Number(newExercise.reps || 0) : undefined,
            duration: newExercise.type === 'cardio' ? Number(newExercise.duration || 0) : undefined,
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

    const handleRemoveExercise = (dayNumber: number, exerciseIndex: number) => {
        setWorkoutDays(currentDays =>
            currentDays.map(day =>
                day.day === dayNumber
                    ? { ...day, exercises: day.exercises.filter((_, i) => i !== exerciseIndex) }
                    : day
            )
        );
    }
    
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

    const isPlanEmpty = workoutDays.every(day => day.exercises.length === 0);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-tight">تخصيص خطة التمرين الخاصة بك</CardTitle>
                    <CardDescription>أضف التمارين التي وصفها لك مدربك لكل يوم.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['day-1']} className="w-full">
                        {workoutDays.map(({ day, exercises }) => (
                            <AccordionItem value={`day-${day}`} key={day}>
                                <AccordionTrigger className="text-lg font-semibold">
                                    يوم التمرين {day}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {exercises.length === 0 ? (
                                        <div className="text-center text-muted-foreground p-4 border rounded-lg">
                                            <p>لم تتم إضافة تمارين بعد.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {exercises.map((ex, index) => (
                                                 <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                                                    <div className='flex items-center gap-3'>
                                                        <div className={cn("p-2 rounded-full", ex.type === 'strength' ? 'bg-primary/20' : 'bg-destructive/20')}>
                                                            {ex.type === 'strength' ? <Dumbbell className="h-5 w-5 text-primary" /> : <Heart className="h-5 w-5 text-destructive" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{ex.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {ex.type === 'strength' ? `${ex.sets} مجموعات × ${ex.reps} عدات` : `${ex.duration} دقيقة`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100" onClick={()={() => handleRemoveExercise(day, index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Button variant="outline" className="w-full" onClick={() => openAddExerciseDialog(day)}>
                                        <PlusCircle className="ml-2 h-5 w-5" />
                                        إضافة تمرين
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full text-lg" onClick={() => onSave(workoutDays)} disabled={isPlanEmpty}>
                        <CheckSquare className='ml-2 h-5 w-5'/>
                        حفظ الكورس
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>إضافة تمرين جديد لليوم {selectedDay}</DialogTitle>
                        <DialogDescription>
                            ابحث عن تمرين أو أدخل اسمًا جديدًا.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="space-y-2">
                                    <Label htmlFor="exercise-name">اسم التمرين</Label>
                                    <Input
                                        id="exercise-name"
                                        value={searchTerm}
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
                                        {searchTerm && "لم يتم العثور على تمارين. يمكنك إضافته."}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        <div className="space-y-2">
                             <Label htmlFor="exercise-type">نوع التمرين</Label>
                             <Select
                                value={newExercise.type}
                                onValueChange={(value: 'strength' | 'cardio') => setNewExercise({ ...newExercise, type: value })}
                            >
                                <SelectTrigger id="exercise-type">
                                    <SelectValue placeholder="اختر النوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="strength">قوة</SelectItem>
                                    <SelectItem value="cardio">كارديو</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {newExercise.type === 'strength' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sets">المجموعات</Label>
                                    <Input
                                        id="sets"
                                        type="number"
                                        value={newExercise.sets || ''}
                                        onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                                        placeholder="3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reps">العدات</Label>
                                    <Input
                                        id="reps"
                                        type="number"
                                        value={newExercise.reps || ''}
                                        onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                                        placeholder="12"
                                    />
                                </div>
                            </div>
                        )}
                        {newExercise.type === 'cardio' && (
                             <div className="space-y-2">
                                <Label htmlFor="duration">المدة (بالدقائق)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={newExercise.duration || ''}
                                    onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) })}
                                    placeholder="30"
                                />
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

function WorkoutPlanDisplay({ plan, onEdit }: { plan: WorkoutDay[], onEdit: () => void }) {
    return (
        <Card>
            <CardHeader className='flex-row items-center justify-between'>
                <div>
                    <CardTitle className="font-headline text-2xl tracking-tight">كورس التمرين الحالي</CardTitle>
                    <CardDescription>هذه هي خطتك التدريبية المحفوظة. بالتوفيق!</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={onEdit}>
                    <Edit className='h-5 w-5' />
                    <span className='sr-only'>تعديل الكورس</span>
                </Button>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['day-1']} className="w-full">
                    {plan.map(({ day, exercises }) => (
                        <AccordionItem value={`day-${day}`} key={day}>
                            <AccordionTrigger className="text-lg font-semibold">
                                يوم التمرين {day}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                {exercises.length === 0 ? (
                                    <div className="text-center text-muted-foreground p-4 border rounded-lg">
                                        <p>لا توجد تمارين لهذا اليوم.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {exercises.map((ex, index) => (
                                             <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                                <div className='flex items-center gap-3'>
                                                    <div className={cn("p-2 rounded-full", ex.type === 'strength' ? 'bg-primary/20' : 'bg-destructive/20')}>
                                                        {ex.type === 'strength' ? <Dumbbell className="h-5 w-5 text-primary" /> : <Heart className="h-5 w-5 text-destructive" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{ex.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {ex.type === 'strength' ? `${ex.sets} مجموعات × ${ex.reps} عدات` : `${ex.duration} دقيقة`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={`ex-done-${day}-${index}`} className='cursor-pointer text-sm'>تم</Label>
                                                    <Input type='checkbox' id={`ex-done-${day}-${index}`} className='h-5 w-5' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

export function WorkoutCourse() {
    const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);
    const [savedPlan, setSavedPlan] = useState<WorkoutDay[] | null>(null);

    const handleSavePlan = (plan: WorkoutDay[]) => {
        setSavedPlan(plan);
        setCourseConfig(null); // Hide the setup view
    };
    
    const handleEditPlan = () => {
        // To re-enter setup, we need a config. We can derive it from the saved plan.
        if (savedPlan) {
            setCourseConfig({
                daysPerWeek: savedPlan.length,
                // A simple logic to determine workoutType, can be improved
                workoutType: savedPlan[0]?.exercises[0]?.type || 'mixed',
            });
            setSavedPlan(null);
        }
    };
    
    if (savedPlan) {
        return <WorkoutPlanDisplay plan={savedPlan} onEdit={handleEditPlan} />;
    }

    if (courseConfig) {
        return <WorkoutPlanSetup config={courseConfig} onSave={handleSavePlan} />;
    }

    return <CourseRegistration onCourseCreate={setCourseConfig} />;
}

    