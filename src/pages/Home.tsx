import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalendarGrid } from '@/components/study/CalendarGrid';
import { useStudy } from '@/contexts/StudyContext';
import { StudyRecord } from '@/types/study';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { studyRecords } = useStudy(); 
  const [currentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditStudy = (study: StudyRecord) => {
    navigate(`/registrar-estudo?edit=${study.id}`);
  };

  const handleAddStudy = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/registrar-estudo?date=${dateStr}`);
  };

  const handleExport = () => {
    window.print(); 
  };

  return (
    <MainLayout title="Tela Inicial">
      {/* Estilos CSS para impressão */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cronograma, #printable-cronograma * {
            visibility: visible;
          }
          #printable-cronograma {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white;
          }
          /* Garante que o grid não corte conteúdo */
          .overflow-x-auto {
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <section className="space-y-4">
        <div id="printable-cronograma" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Cronograma Semanal</h2>
              <span className="text-sm text-muted-foreground capitalize">
                {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            
            <div className="border rounded-xl bg-card p-4 shadow-sm overflow-x-auto print:border-none print:shadow-none print:p-0">
              <CalendarGrid
                studies={studyRecords}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onEditStudy={handleEditStudy}
                onAddStudy={handleAddStudy}
              />
            </div>
        </div>

        <div className="flex justify-start pt-4 no-print">
          <Button 
            onClick={handleExport}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all font-medium"
            size="lg"
          >
            <FileText size={18} />
            Baixar Cronograma em PDF
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}



