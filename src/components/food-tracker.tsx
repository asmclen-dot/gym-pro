import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, PlusCircle, Search, UtensilsCrossed } from 'lucide-react';

const sampleFoods = [
  { name: 'تفاحة', calories: 95, portion: '1 متوسطة' },
  { name: 'صدر دجاج مشوي', calories: 165, portion: '100 جرام' },
  { name: 'أرز بني', calories: 215, portion: '1 كوب، مطبوخ' },
];

export function FoodTracker() {
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
          <Button variant="outline">
            <Barcode className="ml-2 h-5 w-5" />
            مسح الباركود
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground">سجل اليوم</h4>
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
                <p className="font-semibold">{food.calories} سعر حراري</p>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="w-full text-primary hover:text-primary">
            <PlusCircle className="ml-2 h-5 w-5" />
            إضافة طعام آخر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
