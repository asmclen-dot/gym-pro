import { Header } from '@/components/header';
import { CalorieEstimator } from '@/components/calorie-estimator';

export default function CaloriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <CalorieEstimator />
        </div>
      </main>
    </div>
  );
}
