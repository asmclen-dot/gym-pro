import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, PlusCircle, Search, UtensilsCrossed } from 'lucide-react';

const sampleFoods = [
  { name: 'Apple', calories: 95, portion: '1 medium' },
  { name: 'Grilled Chicken Breast', calories: 165, portion: '100g' },
  { name: 'Brown Rice', calories: 215, portion: '1 cup, cooked' },
];

export function FoodTracker() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">Food Diary</CardTitle>
        <CardDescription>Log your meals to stay on track.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for a food..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Barcode className="mr-2 h-5 w-5" />
            Scan Barcode
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground">Today's Log</h4>
          {sampleFoods.map((food, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-background rounded-full border">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{food.name}</p>
                  <p className="text-sm text-muted-foreground">{food.portion}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{food.calories} kcal</p>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="w-full text-primary hover:text-primary">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Another Food
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
