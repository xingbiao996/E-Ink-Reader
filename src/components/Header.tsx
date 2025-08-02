import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60')}>
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
                E-Ink Reader
            </span>
        </Link>
      </div>
    </header>
  );
}
