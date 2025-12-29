import { MainLayout } from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout title="Tela Inicial">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Cronograma</h2>
        
        <div className="p-8 border rounded-lg bg-card text-center">
          <p className="text-muted-foreground">
            O componente de calendário será implementado aqui.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}