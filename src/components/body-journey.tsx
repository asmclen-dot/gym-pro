"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Trash2, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface JourneyImage {
    id: string;
    date: string; // ISO string
    dataUrl: string;
}

export function BodyJourney() {
    const [images, setImages] = useState<JourneyImage[]>([]);
    const [isClient, setIsClient] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedImages = localStorage.getItem('bodyJourneyImages');
            if (savedImages) {
                const parsedImages: JourneyImage[] = JSON.parse(savedImages);
                // Sort images by date, most recent first
                parsedImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setImages(parsedImages);
            }
        } catch (error) {
            console.error("Failed to load images from localStorage", error);
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const newImage: JourneyImage = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    dataUrl,
                };
                const updatedImages = [...images, newImage];
                 updatedImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setImages(updatedImages);
                localStorage.setItem('bodyJourneyImages', JSON.stringify(updatedImages));
            };
            reader.readAsDataURL(file);
        }
         // Reset file input to allow uploading the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleDeleteImage = (id: string) => {
        const updatedImages = images.filter(img => img.id !== id);
        setImages(updatedImages);
        localStorage.setItem('bodyJourneyImages', JSON.stringify(updatedImages));
    }

    if (!isClient) {
        return null;
    }

    return (
        <Card className="shadow-sm w-full">
            <CardHeader>
                <CardTitle className="font-headline tracking-tight text-2xl">رحلة جسمي</CardTitle>
                <CardDescription>تتبع تحولك البصري. قم بتحميل صورة جديدة لتوثيق تقدمك.</CardDescription>
            </CardHeader>
            <CardContent>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                />
                <Button className="w-full text-lg h-12" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="ml-2 h-5 w-5" />
                    تحميل صورة اليوم
                </Button>

                <div className="mt-8 space-y-6">
                    {images.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                            <ImageIcon className="mx-auto h-16 w-16" />
                            <p className="mt-4 font-semibold">لم تقم بتحميل أي صور بعد.</p>
                            <p className="text-sm">ابدأ رحلتك بتحميل صورتك الأولى!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map(image => (
                                <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md">
                                    <Image src={image.dataUrl} alt={`صورة بتاريخ ${image.date}`} width={400} height={600} className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 right-0 p-3 text-white w-full flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4" />
                                            <span className="text-sm font-semibold">{format(new Date(image.date), 'd MMM yyyy', { locale: arSA })}</span>
                                        </div>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    سيؤدي هذا الإجراء إلى حذف الصورة نهائيًا. لا يمكن التراجع عن هذا الإجراء.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteImage(image.id)}>
                                                    نعم، حذف
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
