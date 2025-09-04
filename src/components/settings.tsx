"use client";

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Weight, Target, Footprints, Flame, Wand2, Loader2, PersonStanding, Cake, Activity, AlertTriangle, Trash2, Bot, Ghost, ShieldHalf } from 'lucide-react';
import { Progress } from './ui/progress';
import { getGoalSuggestionAction, SuggestionState } from '@/app/actions';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { debounce } from 'lodash';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from './ui/separator';


interface UserSettings {
    name: string;
    weight: number | string;
    height: number | string;
    age: number | string;
    gender: 'male' | 'female' | '';
    mainGoal: 'lose_weight' | 'gain_muscle' | 'maintain' | '';
    coachPersona: 'default' | 'ninja' | 'sage' | '';
    weeklyCalorieTarget: number | string;
    dailyStepTarget: number | string;
}

export function Settings() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<UserSettings>({
        name: '',
        weight: '',
        height: '',
        age: '',
        gender: '',
        mainGoal: '',
        coachPersona: 'default',
        weeklyCalorieTarget: '',
        dailyStepTarget: '',
    });
    const [isClient, setIsClient] = useState(false);
    const [isSuggesting, startSuggestionTransition] = useTransition();

    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                // Ensure coachPersona has a default value
                if (!parsedSettings.coachPersona) {
                    parsedSettings.coachPersona = 'default';
                }
                setSettings(parsedSettings);
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
    }, []);

    const debouncedSuggestGoals = useCallback(
        debounce((currentSettings: UserSettings) => {
            const { weight, height, age, gender, mainGoal } = currentSettings;
            if (weight && height && age && gender && mainGoal) {
                startSuggestionTransition(async () => {
                    const result: SuggestionState = await getGoalSuggestionAction({
                        weight: Number(weight),
                        height: Number(height),
                        age: Number(age),
                        gender,
                        goal: mainGoal,
                    });
                    if (result.data) {
                        setSettings(prev => ({
                            ...prev,
                            weeklyCalorieTarget: result.data?.suggestedWeeklyCalories || prev.weeklyCalorieTarget,
                            dailyStepTarget: result.data?.suggestedDailySteps || prev.dailyStepTarget,
                        }));
                        toast({
                            title: "تم اقتراح الأهداف!",
                            description: "لقد قمنا بتحديث أهدافك بناءً على بياناتك.",
                        });
                    } else if (result.error) {
                        toast({
                            variant: "destructive",
                            title: "خطأ في الاقتراح",
                            description: result.error,
                        });
                    }
                });
            }
        }, 1000), // 1000ms delay
        [toast]
    );

    const handleInputChange = <K extends keyof UserSettings>(field: K, value: UserSettings[K]) => {
        const newSettings = { ...settings, [field]: value };
        setSettings(newSettings);
        if (['weight', 'height', 'age', 'gender', 'mainGoal'].includes(field as string)) {
             debouncedSuggestGoals(newSettings);
        }
    };

    const handleSave = () => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        toast({
            title: "تم الحفظ بنجاح!",
            description: "تم تحديث إعداداتك.",
        });
    };

    const handleResetApp = () => {
        try {
            localStorage.clear();
            toast({
                title: "تمت إعادة ضبط التطبيق!",
                description: "تم حذف جميع البيانات. سيتم تحديث الصفحة.",
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "خطأ",
                description: "فشلت عملية إعادة الضبط.",
            });
        }
    }
    
    if (!isClient) {
        return null;
    }

    const weeklyCalorieProgress = Math.min(((Number(settings.weeklyCalorieTarget) || 0) / 25000) * 100, 100);
    const dailyStepProgress = Math.min(((Number(settings.dailyStepTarget) || 0) / 15000) * 100, 100);

    const coachPersonas = [
        { id: 'default', name: 'المدرب الافتراضي', description: 'تشجيعي، واضح، ومباشر.', icon: <ShieldHalf /> },
        { id: 'ninja', name: 'النينجا الحماسي', description: 'سريع، قوي، ويركز على الانضباط.', icon: <Ghost /> },
        { id: 'sage', name: 'الحكيم الهادئ', description: 'ملهم، صبور، ويركز على التوازن.', icon: <Bot /> }
    ];

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl tracking-tight">الإعدادات الشخصية</CardTitle>
                            <CardDescription>قم بتخصيص ملفك الشخصي وأهدافك. سيقوم الذكاء الاصطناعي باقتراح أهداف لك تلقائيًا عند تغيير بياناتك.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className='flex items-center gap-2'><User className='h-4 w-4'/> اسم المستخدم</Label>
                                <Input
                                    id="name"
                                    value={settings.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="اكتب اسمك هنا"
                                />
                            </div>
                            
                            <Separator />

                            <RadioGroup value={settings.coachPersona} onValueChange={(value) => handleInputChange('coachPersona', value as UserSettings['coachPersona'])} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Label className="md:col-span-3 text-base flex items-center gap-2 mb-2">اختر شخصية مدربك</Label>
                                {coachPersonas.map((persona) => (
                                <Label htmlFor={persona.id} key={persona.id} className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:border-primary">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {React.cloneElement(persona.icon, { className: 'h-6 w-6' })}
                                            <span className="font-bold">{persona.name}</span>
                                        </div>
                                        <RadioGroupItem value={persona.id} id={persona.id} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{persona.description}</p>
                                </Label>
                                ))}
                            </RadioGroup>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="weight" className='flex items-center gap-2'><Weight className='h-4 w-4'/> وزنك (كغ)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={settings.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                        placeholder="مثال: 75"
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="height" className='flex items-center gap-2'><PersonStanding className='h-4 w-4'/> طولك (سم)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={settings.height}
                                        onChange={(e) => handleInputChange('height', e.target.value)}
                                        placeholder="مثال: 180"
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="age" className='flex items-center gap-2'><Cake className='h-4 w-4'/> عمرك</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={settings.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        placeholder="مثال: 28"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                 <Label className='flex items-center gap-2'><Activity className='h-4 w-4'/> جنسك</Label>
                                 <RadioGroup
                                    value={settings.gender}
                                    onValueChange={(value) => handleInputChange('gender', value as UserSettings['gender'])}
                                    className="flex gap-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="male" id="male" />
                                      <Label htmlFor="male">ذكر</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="female" id="female" />
                                      <Label htmlFor="female">أنثى</Label>
                                    </div>
                                  </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="main-goal" className='flex items-center gap-2'><Target className='h-4 w-4'/> هدفك الأساسي</Label>
                                <Select value={settings.mainGoal} onValueChange={(value) => handleInputChange('mainGoal', value as UserSettings['mainGoal'])}>
                                    <SelectTrigger id="main-goal">
                                        <SelectValue placeholder="اختر هدفك..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lose_weight">خسارة الوزن</SelectItem>
                                        <SelectItem value="gain_muscle">بناء العضلات</SelectItem>
                                        <SelectItem value="maintain">الحفاظ على الوزن</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="relative pt-4">
                                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                                    أهداف مقترحة بالذكاء الاصطناعي
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="weekly-calories" className='flex items-center gap-2'><Flame className='h-4 w-4'/> هدف السعرات الحرارية الأسبوعي</Label>
                                        <Input
                                            id="weekly-calories"
                                            type="number"
                                            value={settings.weeklyCalorieTarget}
                                            onChange={(e) => setSettings(prev => ({...prev, weeklyCalorieTarget: e.target.value}))}
                                            placeholder="مثال: 14000"
                                            disabled={isSuggesting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="daily-steps" className='flex items-center gap-2'><Footprints className='h-4 w-4'/> هدف الخطوات اليومي</Label>
                                        <Input
                                            id="daily-steps"
                                            type="number"
                                            value={settings.dailyStepTarget}
                                            onChange={(e) => setSettings(prev => ({...prev, dailyStepTarget: e.target.value}))}
                                            placeholder="مثال: 8000"
                                            disabled={isSuggesting}
                                        />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full sm:w-auto" disabled={isSuggesting}>
                                <Save className="ml-2 h-4 w-4" />
                                حفظ الإعدادات
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                 <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl tracking-tight text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            منطقة الخطر
                        </CardTitle>
                        <CardDescription>
                            هذه الإجراءات لا يمكن التراجع عنها. يرجى توخي الحذر.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive" className="w-full sm:w-auto">
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    إعادة ضبط البرنامج بالكامل
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                    سيؤدي هذا الإجراء إلى حذف جميع بياناتك نهائيًا، بما في ذلك الإعدادات، تقدم التمارين، سجلات الطعام، صور رحلتك، والإنجازات. لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetApp} className="bg-destructive hover:bg-destructive/90">
                                    نعم، قم بحذف كل شيء
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>ملخص الأهداف</CardTitle>
                        <CardDescription>نظرة سريعة على أهدافك.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                             <div className="mb-1 flex justify-between items-baseline">
                                <h4 className="text-sm font-medium">هدف السعرات الأسبوعي</h4>
                                <span className="text-sm font-mono text-muted-foreground">{Number(settings.weeklyCalorieTarget).toLocaleString() || 0} سعر حراري</span>
                            </div>
                            <Progress value={weeklyCalorieProgress} />
                        </div>
                         <div>
                             <div className="mb-1 flex justify-between items-baseline">
                                <h4 className="text-sm font-medium">هدف الخطوات اليومي</h4>
                                 <span className="text-sm font-mono text-muted-foreground">{Number(settings.dailyStepTarget).toLocaleString() || 0} خطوة</span>
                            </div>
                            <Progress value={dailyStepProgress} indicatorClassName="bg-accent-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
