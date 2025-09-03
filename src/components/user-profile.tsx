"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, Upload, User } from 'lucide-react';

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('المستخدم');
  const [avatar, setAvatar] = useState('https://picsum.photos/100/100');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline tracking-tight">الملف الشخصي</CardTitle>
          <CardDescription>قم بتخصيص ملفك الشخصي.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          <span className="sr-only">{isEditing ? 'حفظ' : 'تعديل'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={avatar} alt="الصورة الرمزية للمستخدم" data-ai-hint="person face" />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 -right-2 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="w-full space-y-2">
              <Label htmlFor="username" className="sr-only">اسم المستخدم</Label>
              <Input
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center text-lg font-bold"
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold font-headline">{userName}</h2>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
