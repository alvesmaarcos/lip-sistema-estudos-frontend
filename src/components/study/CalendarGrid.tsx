import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudyRecord } from '@/types/study';
import { StudyCard } from '@/components/study/StudyCard'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface CalendarGridProps {
  studies: StudyRecord[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onEditStudy: (study: StudyRecord) => void;
  onAddStudy: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarGrid({
  studies,
  currentDate,
  onEditStudy,
  onAddStudy,
}: CalendarGridProps) {
  // Gera os 7 dias da semana a partir da data atual
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const getStudiesForDate = (date: Date) => {
    return studies.filter((study) => 
      // Correção de Fuso Horário aplicada aqui também
      isSameDay(new Date(study.date.replace(/-/g, '/')), date)
    );
  };

  return (
    <div className="grid grid-cols-7 gap-4 min-w-[1000px] lg:min-w-full">
      {/* Cabeçalho dos Dias */}
      {weekDays.map((day) => (
        <div key={day.toString()} className="text-center space-y-2 mb-2">
          <div className="font-medium text-muted-foreground capitalize text-sm">
            {format(day, 'EEE', { locale: ptBR })}
          </div>
          <div className={cn(
            "mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors",
            isSameDay(day, new Date()) 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-foreground bg-secondary/50"
          )}>
            {format(day, 'd')}
          </div>
        </div>
      ))}

      {/* Colunas de Conteúdo */}
      {weekDays.map((day) => {
        const dayStudies = getStudiesForDate(day);
        
        return (
          <div 
            key={day.toString()} 
            className="min-h-[400px] border-l first:border-l-0 border-border/40 bg-muted/5 rounded-lg p-2 flex flex-col gap-2 group/col hover:bg-muted/10 transition-colors relative"
          >
            <ScrollArea className="flex-1 -mr-2 pr-2">
              <div className="space-y-2 pb-8"> 
                {dayStudies.map((study) => (
                  <StudyCard 
                    key={study.id}
                    study={study}
                    onClick={() => onEditStudy(study)}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Botão de Adicionar */}
            <div className="absolute bottom-2 left-0 right-0 px-2 opacity-0 group-hover/col:opacity-100 transition-opacity duration-200">
               <button
                onClick={() => onAddStudy(day)}
                className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md border border-primary/20 transition-all"
              >
                <Plus size={14} />
                Adicionar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}