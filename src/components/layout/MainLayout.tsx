import { ReactNode, useState } from 'react';
import { Sidebar, SidebarContent } from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; //

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar userName="Clidenor" className="hidden md:flex shrink-0 fixed h-full z-20" />
      <div className="hidden md:block w-64 shrink-0" />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden flex items-center gap-4 p-4 border-b bg-card sticky top-0 z-30">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="p-0 w-[280px]">
               <SidebarContent 
                 userName="Clidenor" 
                 onItemClick={() => setIsMobileOpen(false)} 
               />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-bold truncate">{title}</h1>
        </header>

        <main className="flex-1 p-4 md:p-8 animate-fade-in w-full max-w-[1600px] mx-auto">
          <header className="hidden md:flex mb-6 items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          </header>
          
          {children}
        </main>
      </div>
    </div>
  );
}