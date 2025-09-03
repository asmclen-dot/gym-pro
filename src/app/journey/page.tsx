import { Header } from '@/components/header';
import { BodyJourney } from '@/components/body-journey';

export default function JourneyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <BodyJourney />
        </div>
      </main>
    </div>
  );
}
