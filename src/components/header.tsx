import { Leaf } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          صحة كوتش
        </h1>
      </div>
      <Avatar>
        <AvatarImage src="https://picsum.photos/100/100" alt="الصورة الرمزية للمستخدم" data-ai-hint="person face" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
}
