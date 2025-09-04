"use client"

import * as React from "react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { arSA } from "date-fns/locale"
import { Calendar as CalendarIcon, Loader2, FileText, BrainCircuit, BarChart, Utensils, Dumbbell, TrendingDown, ClipboardList } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { getReportAction, ReportState } from "@/app/actions"
import { FitnessReportInput } from "@/app/types"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "./ui/separator"

const initialState: ReportState = {
  data: null,
  error: null,
  message: null,
};


export function ReportsGenerator({ className }: React.HTMLAttributes<"div">) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  })
  const [state, setState] = React.useState(initialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    setIsClient(true);
    if (state.error) {
      toast({
        variant: "destructive",
        title: "أوه لا! حدث خطأ ما.",
        description: state.error,
      })
      setIsLoading(false);
    }
     if (state.data) {
      setIsLoading(false);
    }
  }, [state, toast]);

  const handleGenerateReport = async () => {
    if (!date?.from || !date?.to) {
        toast({ variant: "destructive", title: "الرجاء تحديد نطاق زمني."});
        return;
    }
    
    setIsLoading(true);

    const interval = eachDayOfInterval({ start: date.from, end: date.to });
    const dailyData: FitnessReportInput['dailyData'] = {};
    let userWeight: number | undefined;
    let coachPersona: 'default' | 'ninja' | 'sage' = 'default';

    try {
        const settingsData = localStorage.getItem('userSettings');
        if (settingsData) {
            const parsedSettings = JSON.parse(settingsData);
            if (parsedSettings.weight) {
                userWeight = Number(parsedSettings.weight);
            }
            if (parsedSettings.coachPersona) {
                coachPersona = parsedSettings.coachPersona;
            }
        }
    } catch (error) {
        console.error("Failed to read user settings from localStorage", error);
    }


    interval.forEach(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        try {
            const storedData = localStorage.getItem(dateString);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const foodCalories = parsedData.foods?.reduce((acc: number, food: any) => acc + (food.calories || 0), 0) || 0;
                const workoutCalories = parsedData.workoutCalories || 0;
                const steps = parsedData.steps || 0;
                dailyData[dateString] = { 
                    calories: foodCalories - workoutCalories,
                    steps: steps
                };
            } else {
                dailyData[dateString] = { calories: 0, steps: 0 };
            }
        } catch (error) {
            console.error(`Failed to parse data for ${dateString}:`, error);
            dailyData[dateString] = { calories: 0, steps: 0 };
        }
    });

    const input: FitnessReportInput = {
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to, 'yyyy-MM-dd'),
      dailyData: dailyData,
      userWeightKg: userWeight,
      coachPersona: coachPersona
    };

    const result = await getReportAction(input);
    setState(result);
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }


  const ReportIcon = ({ section }: { section: string }) => {
    switch (section) {
        case 'summary': return <ClipboardList className="h-6 w-6 text-primary" />;
        case 'diet': return <Utensils className="h-6 w-6 text-primary" />;
        case 'workout': return <Dumbbell className="h-6 w-6 text-primary" />;
        case 'results': return <TrendingDown className="h-6 w-6 text-primary" />;
        case 'recommendations': return <BrainCircuit className="h-6 w-6 text-primary" />;
        default: return <FileText className="h-6 w-6 text-primary" />;
    }
  }

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-tight">إنشاء تقرير الأداء</CardTitle>
        <CardDescription>اختر الفترة الزمنية التي تريد تحليلها، ودع الذكاء الاصطناعي يقوم بالباقي.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-2", className)}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-right font-normal h-11",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL, dd, y", {locale: arSA})} -{" "}
                      {format(date.to, "LLL, dd, y", {locale: arSA})}
                    </>
                  ) : (
                    format(date.from, "LLL, dd, y", {locale: arSA})
                  )
                ) : (
                  <span>اختر تاريخًا</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={arSA}
                dir="rtl"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
       <CardFooter>
        <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full text-lg h-12">
            {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="ml-2 h-5 w-5" />}
            {isLoading ? 'جاري تحليل البيانات...' : 'إنشاء التقرير بالذكاء الاصطناعي'}
        </Button>
      </CardFooter>
    </Card>

     {state.data && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-2xl tracking-tight flex items-center gap-3">
                <BarChart className="h-7 w-7" />
                تقرير الأداء الخاص بك
            </CardTitle>
            <CardDescription>
                تحليل الفترة من {date?.from ? format(date.from, "d LLL yyyy", {locale: arSA}) : ''} إلى {date?.to ? format(date.to, "d LLL yyyy", {locale: arSA}) : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="p-4 bg-secondary/50 rounded-lg flex items-start gap-4">
                  <ReportIcon section="summary" />
                  <div>
                      <h4 className="font-bold text-lg">ملخص الفترة</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{state.data.periodSummary}</p>
                  </div>
              </div>
              <Separator />
               <div className="p-4 bg-secondary/50 rounded-lg flex items-start gap-4">
                  <ReportIcon section="diet" />
                  <div>
                      <h4 className="font-bold text-lg">تحليل النظام الغذائي</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{state.data.dietaryAnalysis}</p>
                  </div>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg flex items-start gap-4">
                  <ReportIcon section="workout" />
                  <div>
                      <h4 className="font-bold text-lg">تحليل التمارين</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{state.data.workoutAnalysis}</p>
                  </div>
              </div>
               <Separator />
               <div className="p-4 bg-accent/50 rounded-lg flex items-start gap-4 border-r-4 border-accent-foreground/50">
                  <ReportIcon section="results" />
                  <div>
                      <h4 className="font-bold text-lg text-accent-foreground">النتائج التقديرية</h4>
                      <p className="text-accent-foreground/90 whitespace-pre-line">{state.data.estimatedResults}</p>
                  </div>
              </div>
               <Separator />
               <div className="p-4 bg-secondary/50 rounded-lg flex items-start gap-4">
                  <ReportIcon section="recommendations" />
                  <div>
                      <h4 className="font-bold text-lg">التوصيات</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{state.data.recommendations}</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
