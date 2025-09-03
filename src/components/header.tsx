import { Leaf, Settings } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          صحة كوتش
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/settings">
            <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">الإعدادات</span>
            </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
