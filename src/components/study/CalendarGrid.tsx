import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StudyRecord } from '@/types/study';
import { StudyCard } from './StudyCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

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
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const getStudiesForDate = (date: Date) => {
    return studies.filter((study) => 
      isSameDay(new Date(study.date.replace(/-/g, '/')), date)
    );
  };

  return (
    <div className="w-full">
      
      <div className="hidden md:grid grid-cols-7 gap-4 mb-2">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center space-y-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayStudies = getStudiesForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "group/col relative flex flex-col gap-2 rounded-lg border transition-all",
                // Estilos Desktop
                "md:min-h-[400px] md:border-l md:border-t-0 md:border-r-0 md:border-b-0 md:border-border/40 md:bg-muted/5 md:p-2 md:hover:bg-muted/10",
                // Estilos Mobile (Card Fechado)
                "min-h-[120px] p-4 bg-card border-border shadow-sm md:shadow-none"
              )}
            >
              
              <div className="md:hidden flex items-center justify-between mb-2 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm",
                    isToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  )}>
                    {format(day, 'd')}
                  </div>
                  <span className={cn("font-medium capitalize", isToday && "text-primary")}>
                    {format(day, 'EEEE', { locale: ptBR })}
                  </span>
                </div>
                {isToday && <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full">Hoje</span>}
              </div>

              <ScrollArea className="flex-1 md:-mr-2 md:pr-2">
                <div className="space-y-2 pb-8 md:pb-8"> 
                  {dayStudies.length > 0 ? (
                    dayStudies.map((study) => (
                      <StudyCard 
                        key={study.id}
                        study={study}
                        onClick={() => onEditStudy(study)}
                      />
                    ))
                  ) : (
                    // Mensagem de "Vazio" apenas no Mobile para não ficar um buraco em branco
                    <div className="md:hidden text-center py-4 text-muted-foreground text-xs flex flex-col items-center gap-1 opacity-60">
                      <CalendarIcon size={16} />
                      <span>Nada registrado</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="mt-auto pt-2 md:absolute md:bottom-2 md:left-0 md:right-0 md:px-2 md:opacity-0 md:group-hover/col:opacity-100 transition-opacity duration-200">
                 <button
                  onClick={() => onAddStudy(day)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-md border transition-all font-medium",
                    // Mobile Styles
                    "py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    // Desktop Styles (Revertendo para o estilo clean)
                    "md:py-1.5 md:text-[10px] md:text-primary md:bg-primary/10 md:hover:bg-primary/20 md:border-primary/20"
                  )}
                >
                  <Plus size={14} />
                  <span>Adicionar novo estudo</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}