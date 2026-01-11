import { Check, Trash2 } from "lucide-react";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";
import { useDisciplines } from "@/contexts/DisciplineContext";
import { Badge } from "@/components/ui/badge";
import { getDisciplineTheme } from "@/lib/constants";
import { differenceInCalendarDays } from "date-fns";
import { normalizeDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";

interface ReviewCardProps {
  review: Review;
  variant: "today" | "overdue" | "completed";
  onToggle?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  review,
  variant,
  onToggle,
  onDelete,
}: ReviewCardProps) {
  const { disciplines } = useDisciplines();
  const discipline = disciplines.find((d) => d.id === review.disciplineId) || {
    id: "unknown",
    name: review.disciplineName || "Desconhecido",
    color: "blue",
  };

  const theme = getDisciplineTheme(discipline.color);

  const daysOverdue =
    variant === "overdue"
      ? differenceInCalendarDays(new Date(), normalizeDate(review.dueDate))
      : 0;

  const getRevisionLabel = (num: number) => {
    const labels: Record<number, string> = {
      1: "1ª Revisão (D+1)",
      2: "2ª Revisão (D+7)",
      3: "3ª Revisão (D+14)",
    };
    return labels[num] || `Revisão ${num}`;
  };

  const getOverdueLabel = (days: number) => {
    if (days <= 1) return "Atrasado: Ontem";
    return `Atrasado: ${days} dias`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 border",
        variant === "overdue" && "bg-destructive/5 border-destructive/10",
        variant === "completed" && "opacity-60 grayscale",
        variant === "today" &&
          "bg-card hover:bg-accent/50 border-border/50 shadow-sm"
      )}
    >
      {/* Barra de cor da disciplina */}
      <div
        className={cn(
          "w-1.5 h-12 rounded-full flex-shrink-0",
          variant === "completed" && "bg-muted-foreground/30"
        )}
        style={
          variant !== "completed" ? { backgroundColor: theme.hex } : undefined
        }
      />

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-[10px] md:text-xs font-bold uppercase tracking-wider",
              variant === "completed"
                ? "text-muted-foreground"
                : variant === "overdue"
                ? "text-destructive"
                : ""
            )}
            style={
              variant !== "completed" && variant !== "overdue"
                ? { color: theme.hex }
                : undefined
            }
          >
            {discipline.name}
          </span>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {getRevisionLabel(review.revisionNumber)}
          </Badge>
        </div>

        <p
          className={cn(
            "font-medium text-foreground text-sm md:text-base truncate",
            variant === "completed" && "line-through text-muted-foreground"
          )}
        >
          {review.topic}
        </p>

        {variant === "overdue" && daysOverdue > 0 && (
          <p className="text-xs text-destructive mt-1">
            {getOverdueLabel(daysOverdue)}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
            title="Deletar revisão"
          >
            <Trash2 size={16} />
          </Button>
        )}

        <button
          onClick={onToggle}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variant === "completed"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
          )}
        >
          {variant === "completed" && <Check size={16} strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}
