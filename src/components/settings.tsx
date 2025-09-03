"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Weight, Target, Footprints, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

interface UserSettings {
    name: string;
    weight: number | string;
    mainGoal: 'lose_weight' | 'gain_muscle' | 'maintain' | '';
    weeklyCalorieTarget: number | string;
    dailyStepTarget: number | string;
}

export function Settings() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<UserSettings>({
        name: '',
        weight: '',
        mainGoal: '',
        weeklyCalorieTarget: '',
        dailyStepTarget: '',
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
    }, []);

    const handleInputChange = (field: keyof UserSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        toast({
            title: "تم الحفظ بنجاح!",
            description: "تم تحديث إعداداتك.",
        });
    };
    
    // This component will only render on the client, preventing hydration mismatch
    if (!isClient) {
        return null;
    }

    const weeklyCalorieProgress = Math.min(((Number(settings.weeklyCalorieTarget) || 0) / 25000) * 100, 100);
    const dailyStepProgress = Math.min(((Number(settings.dailyStepTarget) || 0) / 15000) * 100, 100);

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl tracking-tight">الإعدادات</CardTitle>
                        <CardDescription>قم بتخصيص ملفك الشخصي وأهدافك لتجربة أفضل.</CardDescription>
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
                        <div className="space-y-2">
                            <Label htmlFor="weight" className='flex items-center gap-2'><Weight className='h-4 w-4'/> وزنك الحالي (كغ)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={settings.weight}
                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                placeholder="مثال: 75"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="main-goal" className='flex items-center gap-2'><Target className='h-4 w-4'/> هدفك الأساسي</Label>
                            <Select value={settings.mainGoal} onValueChange={(value) => handleInputChange('mainGoal', value)}>
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
                        <div className="space-y-2">
                            <Label htmlFor="weekly-calories" className='flex items-center gap-2'><Flame className='h-4 w-4'/> هدف السعرات الحرارية الأسبوعي</Label>
                            <Input
                                id="weekly-calories"
                                type="number"
                                value={settings.weeklyCalorieTarget}
                                onChange={(e) => handleInputChange('weeklyCalorieTarget', e.target.value)}
                                placeholder="مثال: 14000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="daily-steps" className='flex items-center gap-2'><Footprints className='h-4 w-4'/> هدف الخطوات اليومي</Label>
                            <Input
                                id="daily-steps"
                                type="number"
                                value={settings.dailyStepTarget}
                                onChange={(e) => handleInputChange('dailyStepTarget', e.target.value)}
                                placeholder="مثال: 8000"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full sm:w-auto">
                            <Save className="ml-2 h-4 w-4" />
                            حفظ الإعدادات
                        </Button>
                    </CardFooter>
                </form>
            </Card>

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
