import { Header } from '@/components/header';
import { Stats } from '@/components/stats';
import { FoodTracker } from '@/components/food-tracker';
import { RecipeGenerator } from '@/components/recipe-generator';
import { UserProfile } from '@/components/user-profile';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, FileText, Flame, Trophy, Camera } from 'lucide-react';
import { WorkoutCoursePreview } from '@/components/workout-course-preview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Link href="/gym">
              <Button className="w-full h-16 text-lg">
                <Dumbbell className="ml-4 h-6 w-6" />
                اذهب إلى الجيم
              </Button>
            </Link>
             <Link href="/calories">
              <Button className="w-full h-16 text-lg" variant="secondary">
                <Flame className="ml-4 h-6 w-6" />
                تقدير سعرات التمرين
              </Button>
            </Link>
             <Link href="/reports">
              <Button className="w-full h-16 text-lg" variant="outline">
                <FileText className="ml-4 h-6 w-6" />
                إنشاء تقرير الأداء
              </Button>
            </Link>
            <Link href="/achievements">
              <Button className="w-full h-16 text-lg">
                <Trophy className="ml-4 h-6 w-6" />
                الإنجازات
              </Button>
            </Link>
            <Link href="/journey">
              <Button className="w-full h-16 text-lg" variant="secondary">
                <Camera className="ml-4 h-6 w-6" />
                رحلة جسمي
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <Stats />
            </div>

            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <FoodTracker />
              <WorkoutCoursePreview />
            </div>

            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              <UserProfile />
              <RecipeGenerator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
