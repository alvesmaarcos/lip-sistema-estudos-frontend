import { Check } from "lucide-react";
import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";
import { useDisciplines } from "@/contexts/DisciplineContext";
import { Badge } from "@/components/ui/badge";
import { getDisciplineTheme } from "@/lib/constants";

interface ReviewCardMiniProps {
  review: Review;
  onToggle: () => void;
}

export function ReviewCardMini({ review, onToggle }: ReviewCardMiniProps) {
  const { disciplines } = useDisciplines();
  const discipline = disciplines.find((d) => d.id === review.disciplineId) || {
    id: "unknown",
    name: review.disciplineName || "Desconhecido",
    color: "blue",
  };

  const theme = getDisciplineTheme(discipline.color);

  const getRevisionLabel = (num: number) => {
    const labels: Record<number, string> = {
      1: "Rev. 1 (D+1)",
      2: "Rev. 2 (D+7)",
      3: "Rev. 3 (D+14)",
    };
    return labels[num] || `Rev. ${num}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border bg-card/50 transition-all duration-200",
        review.completed && "opacity-60"
      )}
    >
      {/* Barra de cor */}
      <div
        className={cn(
          "w-1 h-8 rounded-full flex-shrink-0",
          review.completed && "bg-muted-foreground/30"
        )}
        style={!review.completed ? { backgroundColor: theme.hex } : undefined}
      />

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mb-0.5">
          {getRevisionLabel(review.revisionNumber)}
        </Badge>
        <p
          className={cn(
            "text-xs font-medium truncate",
            review.completed && "line-through text-muted-foreground"
          )}
        >
          {review.topic}
        </p>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
          review.completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {review.completed && <Check size={12} strokeWidth={3} />}
      </button>
    </div>
  );
}
