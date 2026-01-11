import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";

import { MainLayout } from "@/components/layout/MainLayout";
import { CalendarGrid } from "@/components/study/CalendarGrid";
import { Button } from "@/components/ui/button";

import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useStudies } from "@/hooks/use-studies";
import { downloadPdfReport } from "@/http/api/report";
import { toast } from "sonner";

import type { StudyRecord } from "@/types/study";
import type { StudyResponse } from "@/http/api/study";
import { useReviews } from "@/hooks/use-reviews";

export default function Home() {
  const navigate = useNavigate();

  const { allReviews, toggleReview } = useReviews();

  const { studies: apiStudies, isLoading } = useStudies();

  const studies: StudyRecord[] = apiStudies.map((study: StudyResponse) => ({
    id: String(study.id),
    disciplineId: String(study.disciplineId),
    timeSpent: study.timeSpent,
    date: study.date,
    topic: study.topic,
    notes: study.notes || "",
    createdAt: new Date().toISOString(),
    revisions: [],
  }));

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEditStudy = (study: StudyRecord) => {
    navigate(`/registrar-estudo?edit=${study.id}`);
  };

  const handleAddStudy = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    navigate(`/registrar-estudo?date=${dateStr}`);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await downloadPdfReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `cronograma-${format(new Date(), "yyyy-MM-dd")}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF", {
        description: "Tente novamente em instantes.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentWeek =
    format(currentDate, "yyyy-w") === format(new Date(), "yyyy-w");

  if (isLoading) {
    return (
      <MainLayout title="Tela Inicial">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Tela Inicial">
      <section className="space-y-6">
        {/* Cabeçalho com navegação */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              Cronograma Semanal
            </h2>

            {/* Controles de navegação */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousWeek}
                title="Semana anterior"
                className="h-10 w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted min-w-max">
                <span className="text-sm font-medium text-muted-foreground">
                  {format(currentDate, "MMM", { locale: ptBR })}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {format(currentDate, "yyyy")}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextWeek}
                title="Próxima semana"
                className="h-10 w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {!isCurrentWeek && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToToday}
                  className="ml-2"
                >
                  Hoje
                </Button>
              )}
            </div>

            <span className="text-sm text-muted-foreground capitalize w-full md:w-auto md:text-right">
              {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          {/* Grid do calendário */}
          <div className="border rounded-xl bg-card p-4 shadow-sm overflow-x-auto">
            <CalendarGrid
              studies={studies}
              reviews={allReviews}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onEditStudy={handleEditStudy}
              onAddStudy={handleAddStudy}
              onToggleReview={toggleReview}
            />
          </div>
        </div>

        {/* Botão de exportação */}
        <div className="flex justify-start pt-4">
          <Button
            onClick={handleExport}
            disabled={isExporting || studies.length === 0}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            size="lg"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            {isExporting ? "Gerando..." : "Baixar Cronograma em PDF"}
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
