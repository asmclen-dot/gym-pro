import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, HeartPulse, PersonStanding, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const workoutPlans = [
  {
    title: 'Morning Cardio',
    duration: '20 min',
    icon: <HeartPulse />,
    image: 'https://picsum.photos/300/200?random=1',
    dataAiHint: 'running fitness',
  },
  {
    title: 'Full Body Strength',
    duration: '45 min',
    icon: <Dumbbell />,
    image: 'https://picsum.photos/300/200?random=2',
    dataAiHint: 'weightlifting gym',
  },
  {
    title: 'Quick Home Workout',
    duration: '10 min',
    icon: <PersonStanding />,
    image: 'https://picsum.photos/300/200?random=3',
    dataAiHint: 'home workout',
  },
];

export function ActivityTracker() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">Workout Plans</CardTitle>
        <CardDescription>Find a plan that fits your day.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutPlans.map((plan, index) => (
          <div key={index} className="relative group overflow-hidden rounded-lg shadow-inner">
            <Image
              src={plan.image}
              alt={plan.title}
              width={300}
              height={200}
              data-ai-hint={plan.dataAiHint}
              className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-primary-foreground">
              <h3 className="font-bold text-lg">{plan.title}</h3>
              <p className="text-sm opacity-90">{plan.duration}</p>
            </div>
            <div className="absolute top-4 right-4">
               {React.cloneElement(plan.icon, { className: "h-6 w-6 text-primary-foreground/80" })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <Button size="icon" variant="secondary" className="rounded-full h-14 w-14">
                <PlayCircle className="h-8 w-8" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
