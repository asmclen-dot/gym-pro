'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, Droplets, Leaf, Footprints } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from './ui/input';
import { debounce } from 'lodash';

const habitsConfig = [
  { id: 'water', label: 'شرب 8 أكواب من الماء', icon: <Droplets /> },
  { id: 'sleep', label: 'النوم 7-8 ساعات', icon: <Bed /> },
  { id: 'sugar', label: 'تجنب المشروبات السكرية', icon: <Leaf /> },
];

export function HabitTracker() {
  const [checkedHabits, setCheckedHabits] = useState<Record<string, boolean>>({});
  const [steps, setSteps] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(today);
      if (storedData) {
        const data = JSON.parse(storedData);
        setCheckedHabits(data.habits || {});
        setSteps(data.steps || '');
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage', error);
    }
  }, [today]);

  const updateLocalStorage = (data: Record<string, any>) => {
    try {
      const storedData = localStorage.getItem(today);
      const currentData = storedData ? JSON.parse(storedData) : {};
      const updatedData = { ...currentData, ...data };
      localStorage.setItem(today, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to update localStorage', error);
    }
  };

  const debouncedUpdateSteps = useCallback(
    debounce((value: number) => {
      updateLocalStorage({ steps: value });
    }, 500),
    [today]
  );

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSteps(value);
    debouncedUpdateSteps(Number(value));
  };

  const handleHabitChange = (habitId: string, isChecked: boolean) => {
    const newCheckedHabits = { ...checkedHabits, [habitId]: isChecked };
    setCheckedHabits(newCheckedHabits);
    updateLocalStorage({ habits: newCheckedHabits });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">العادات والخطوات اليومية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            {habitsConfig.map((habit) => (
              <div key={habit.id} className="flex items-center space-x-4 p-3 rounded-lg transition-colors hover:bg-secondary/50 has-[[data-state=checked]]:bg-accent/50 has-[[data-state=checked]]:text-accent-foreground">
                {React.cloneElement(habit.icon, { className: 'h-6 w-6 text-primary' })}
                <label htmlFor={habit.id} className="flex-1 text-sm font-medium leading-none cursor-pointer">
                  {habit.label}
                </label>
                <Checkbox
                  id={habit.id}
                  checked={!!checkedHabits[habit.id]}
                  onCheckedChange={(checked) => handleHabitChange(habit.id, !!checked)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-lg">
             <Footprints className="h-6 w-6 text-primary" />
             <label htmlFor="steps" className="flex-1 text-sm font-medium leading-none">
                خطوات اليوم
              </label>
             <Input 
                id="steps"
                type="number"
                placeholder="أدخل خطواتك"
                className="w-32 h-9"
                value={steps}
                onChange={handleStepChange}
             />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
