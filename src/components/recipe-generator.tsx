"use client";

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getRecipeAction, RecipeState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ChefHat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: RecipeState = {
  data: null,
  error: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          جارٍ الإنشاء...
        </>
      ) : (
        <>
          <Sparkles className="ml-2 h-4 w-4" />
          إنشاء وصفة
        </>
      )}
    </Button>
  );
}

export function RecipeGenerator() {
  const [state, formAction] = useFormState(getRecipeAction, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "أوه لا! حدث خطأ ما.",
        description: state.error,
      })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-sm">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline tracking-tight">وصفات مخصصة</CardTitle>
          <CardDescription>احصل على وصفة صحية بالمكونات المتوفرة لديك.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">المكونات المتوفرة</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              placeholder="مثال: صدر دجاج، بروكلي، كينوا، زيت زيتون"
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryNeeds">الاحتياجات الغذائية (اختياري)</Label>
            <Input
              id="dietaryNeeds"
              name="dietaryNeeds"
              placeholder="مثال: نباتي، خالي من الغلوتين"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>

      {state.data && (
        <CardContent className="border-t pt-6 mt-6 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-lg">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
             </div>
            <h3 className="text-xl font-bold font-headline text-primary">{state.data.recipeName}</h3>
          </div>
          <div>
            <h4 className="font-semibold mb-2">المكونات:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{state.data.ingredients}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">التعليمات:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{state.data.instructions}</p>
          </div>
           <div>
            <h4 className="font-semibold mb-2">السعرات الحرارية التقديرية:</h4>
            <p className="text-lg font-mono font-bold text-foreground">{state.data.calories}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
