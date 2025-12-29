import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userName="Clidenor" /> {}
      
      <main className="flex-1 p-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
}