"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, User } from 'lucide-react';
import Link from 'next/link';

export function UserProfile() {
  const [userName, setUserName] = useState('المستخدم');
  const [avatar, setAvatar] = useState('https://picsum.photos/100/100');

  useEffect(() => {
    // This effect runs only on the client side
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.name) {
          setUserName(settings.name);
        }
      }
      const savedAvatar = localStorage.getItem('userAvatar');
      if(savedAvatar) {
        setAvatar(savedAvatar);
      }
    } catch (error) {
      console.error("Failed to load user profile data from localStorage", error);
    }
  }, []);


  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline tracking-tight">الملف الشخصي</CardTitle>
          <CardDescription>مرحبًا بك مجددًا!</CardDescription>
        </div>
         <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
              <span className="sr-only">تعديل الملف الشخصي</span>
            </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={avatar} alt="الصورة الرمزية للمستخدم" data-ai-hint="person face" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold font-headline">{userName}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
