"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, PlusCircle, Search, UtensilsCrossed, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Food {
  id: string;
  name: string;
  calories: number;
  portion: string;
}

export function FoodTracker() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: '', portion: '' });
  const { toast } = useToast();
  
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    try {
        const storedData = localStorage.getItem(today);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.foods && Array.isArray(parsedData.foods)) {
                setFoods(parsedData.foods);
            }
        }
    } catch (error) {
        console.error("Failed to parse food data from localStorage", error);
    }
  }, [today]);

  const updateLocalStorage = (updatedFoods: Food[]) => {
     try {
        const storedData = localStorage.getItem(today);
        const data = storedData ? JSON.parse(storedData) : {};
        data.foods = updatedFoods;
        localStorage.setItem(today, JSON.stringify(data));
     } catch (error) {
        console.error("Failed to update localStorage", error);
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "فشل حفظ بيانات الطعام.",
        });
     }
  };


  const handleAddFood = () => {
    if (newFood.name && newFood.calories && newFood.portion) {
      const foodToAdd: Food = { 
          id: crypto.randomUUID(),
          ...newFood, 
          calories: Number(newFood.calories) 
      };
      const updatedFoods = [...foods, foodToAdd];
      setFoods(updatedFoods);
      updateLocalStorage(updatedFoods);
      setNewFood({ name: '', calories: '', portion: '' });
      setIsDialogOpen(false);
    }
  };
  
  const handleRemoveFood = (foodId: string) => {
    const updatedFoods = foods.filter((food) => food.id !== foodId);
    setFoods(updatedFoods);
    updateLocalStorage(updatedFoods);
  };


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">يوميات الطعام</CardTitle>
        <CardDescription>سجل وجباتك للبقاء على المسار الصحيح.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="ابحث عن طعام..." className="pr-10" />
          </div>
          <Button variant="outline" className='flex-shrink-0'>
            <Barcode className="ml-2 h-5 w-5" />
            مسح الباركود
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground">سجل اليوم</h4>
          {foods.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm">لم تقم بتسجيل أي طعام اليوم.</p>
              <p className="text-xs">ابدأ بالبحث عن طعام أو مسح باركود.</p>
            </div>
          ) : (
            foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-full border">
                      <UtensilsCrossed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{food.name}</p>
                    <p className="text-sm text-muted-foreground">{food.portion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                    <p className="font-semibold">{food.calories} سعر حراري</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveFood(food.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          <Button variant="ghost" className="w-full text-primary hover:text-primary" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="ml-2 h-5 w-5" />
            إضافة طعام
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة طعام جديد</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الطعام الذي تريد إضافته إلى سجل يومك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className="col-span-3"
                placeholder="مثال: تفاحة"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="portion" className="text-right">
                الكمية
              </Label>
              <Input
                id="portion"
                value={newFood.portion}
                onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                className="col-span-3"
                placeholder="مثال: قطعة واحدة متوسطة"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                السعرات
              </Label>
              <Input
                id="calories"
                type="number"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                className="col-span-3"
                placeholder="مثال: 95"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                إلغاء
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAddFood}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
