import { cn } from '@/lib/utils';
import { StudyRecord } from '@/types/study';
import { Pencil } from 'lucide-react';

interface StudyCardProps {
  study: StudyRecord;
  onClick?: () => void;
}

const colorClasses: Record<string, string> = {
  purple: 'border-l-purple-500 data-[hover=true]:bg-purple-50 dark:data-[hover=true]:bg-purple-900/10',
  blue: 'border-l-blue-500 data-[hover=true]:bg-blue-50 dark:data-[hover=true]:bg-blue-900/10',
  green: 'border-l-green-500 data-[hover=true]:bg-green-50 dark:data-[hover=true]:bg-green-900/10',
  red: 'border-l-red-500 data-[hover=true]:bg-red-50 dark:data-[hover=true]:bg-red-900/10',
  orange: 'border-l-orange-500 data-[hover=true]:bg-orange-50 dark:data-[hover=true]:bg-orange-900/10',
  navy: 'border-l-indigo-800 data-[hover=true]:bg-indigo-50 dark:data-[hover=true]:bg-indigo-900/10',
};

export function StudyCard({ study, onClick }: StudyCardProps) {
  const colorClass = colorClasses[study.disciplineColor] || colorClasses.blue;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-md border border-border border-l-4 p-3 cursor-pointer shadow-sm transition-all hover:shadow-md hover:translate-x-1",
        colorClass
      )}
      data-hover="true"
    >
      <div className="flex flex-col gap-1 pr-6">
        {/* Disciplina */}
        <div className="font-semibold text-xs text-foreground leading-tight truncate" title={study.discipline}>
          {study.discipline}
        </div>
        
        {/* Tópico */}
        <div className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
          {study.topic}
        </div>
      </div>

      {/* Botão de Editar */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          className="h-6 w-6 bg-background/80 hover:bg-primary hover:text-primary-foreground backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-border transition-colors"
          title="Editar estudo"
        >
          <Pencil size={12} />
        </button>
      </div>
    </div>
  );
}