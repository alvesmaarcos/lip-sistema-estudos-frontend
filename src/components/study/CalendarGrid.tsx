import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StudyRecord } from "@/types/study";
import { Review } from "@/types/review";
import { StudyCard } from "./StudyCard";
import { ReviewCardMini } from "../reviews/ReviewCardMini";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { normalizeDate } from "@/lib/date-utils";

interface CalendarGridProps {
  studies: StudyRecord[];
  reviews: Review[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onEditStudy: (study: StudyRecord) => void;
  onAddStudy: (date: Date) => void;
  selectedDate: Date | null;
  onToggleReview: (id: string) => void;
}

export function CalendarGrid({
  studies,
  reviews,
  currentDate,
  onEditStudy,
  onAddStudy,
  onToggleReview,
}: CalendarGridProps) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(startDate, i)
  );

  const getStudiesForDate = (date: Date) =>
    studies.filter((study) => isSameDay(normalizeDate(study.date), date));

  const getReviewsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return reviews.filter((r) => r.dueDate === dateStr);
  };

  return (
    <div className="w-full">
      {/* Cabeçalho Desktop */}
      <div className="hidden md:grid grid-cols-7 gap-4 mb-2">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center space-y-2">
            <div className="font-medium text-muted-foreground capitalize text-sm">
              {format(day, "EEE", { locale: ptBR })}
            </div>
            <div
              className={cn(
                "mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors",
                isSameDay(day, new Date())
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground bg-secondary/50"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayStudies = getStudiesForDate(day);
          const dayReviews = getReviewsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={cn(
                "group/col relative flex flex-col gap-2 rounded-lg border transition-all",
                "md:min-h-[150px] md:border-l md:border-t-0 md:border-r-0 md:border-b-0 md:border-border/40 md:bg-transparent md:p-2",
                "min-h-[120px] p-4 bg-card border-border shadow-sm md:shadow-none"
              )}
            >
              {/* Cabeçalho Mobile */}
              <div className="md:hidden flex items-center justify-between mb-2 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <span
                    className={cn(
                      "font-medium capitalize",
                      isToday && "text-primary"
                    )}
                  >
                    {format(day, "EEEE", { locale: ptBR })}
                  </span>
                </div>
                {isToday && (
                  <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full">
                    Hoje
                  </span>
                )}
              </div>

              <ScrollArea className="flex-1 md:-mr-2 md:pr-2">
                <div className="space-y-2 pb-14 md:pb-16">
                  {dayStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onClick={() => onEditStudy(study)}
                    />
                  ))}

                  {dayReviews.map((review) => (
                    <ReviewCardMini
                      key={review.id}
                      review={review}
                      onToggle={() => onToggleReview(review.id)}
                    />
                  ))}

                  {dayStudies.length === 0 && dayReviews.length === 0 && (
                    <div className="md:hidden text-center py-4 text-muted-foreground text-xs flex flex-col items-center gap-1 opacity-60">
                      <CalendarIcon size={16} />
                      <span>Nada registrado</span>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* BOTÃO ADICIONAR — INTACTO */}
              <div className="mt-auto pt-2 md:absolute md:bottom-2 md:left-2 md:right-2 md:opacity-0 md:group-hover/col:opacity-100 transition-opacity duration-200 z-10">
                <button
                  onClick={() => onAddStudy(day)}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 rounded-md border border-dashed border-muted-foreground/30 transition-all",
                    "py-2 text-xs text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5",
                    "md:py-1.5 bg-card/80 backdrop-blur-sm shadow-sm"
                  )}
                >
                  <Plus size={12} />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
