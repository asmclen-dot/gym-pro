'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bed, Droplets, Leaf } from 'lucide-react';

const habits = [
  { id: 'water', label: 'Drink 8 glasses of water', icon: <Droplets /> },
  { id: 'sleep', label: 'Sleep 7-8 hours', icon: <Bed /> },
  { id: 'sugar', label: 'Avoid sugary drinks', icon: <Leaf /> },
];

export function HabitTracker() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">Daily Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {habits.map((habit, index) => (
            <div key={habit.id} className="flex items-center space-x-4 p-3 rounded-lg transition-colors hover:bg-secondary/50 has-[[data-state=checked]]:bg-accent/50 has-[[data-state=checked]]:text-accent-foreground">
              {React.cloneElement(habit.icon, { className: "h-6 w-6 text-primary" })}
              <label htmlFor={habit.id} className="flex-1 text-sm font-medium leading-none cursor-pointer">
                {habit.label}
              </label>
              <Checkbox id={habit.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
