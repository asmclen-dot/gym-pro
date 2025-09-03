"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

interface SavedProgress {
    plan: any[];
    currentDay: number;
}

export function WorkoutCoursePreview() {
    const [progress, setProgress] = useState<SavedProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem('workoutProgress');
            if (storedProgress) {
                setProgress(JSON.parse(storedProgress));
            }
        } catch (error) {
            console.error("Failed to load workout progress from localStorage", error);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }
    
    if (!progress) {
        return null; // Don't show the component if no plan exists
    }
    
    const isFinished = progress.currentDay > progress.plan.length;
    const progressPercentage = isFinished ? 100 : ((progress.currentDay -1) / progress.plan.length) * 100;

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline tracking-tight">تقدمك في كورس التمرين</CardTitle>
                <CardDescription>
                    {isFinished ? "لقد أكملت الكورس بنجاح!" : `أنت في اليوم ${progress.currentDay} من ${progress.plan.length}. واصل التقدم!`}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                 <Link href="/gym" className='w-full'>
                    <Button className="w-full text-md">
                        {isFinished ? 'عرض تفاصيل الكورس' : 'استئناف التمرين'}
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
