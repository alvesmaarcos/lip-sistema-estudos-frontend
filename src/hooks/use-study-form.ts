import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useDisciplines } from "@/contexts/DisciplineContext";
import { normalizeDate, formatDateForStorage } from "@/lib/date-utils";
import { useStudies } from "./use-studies";
import { getStudies } from "@/http/api/study";
import { toast } from "sonner";

const studySchema = z.object({
  disciplineId: z.string({ required_error: "Selecione uma disciplina." }),
  timeSpent: z.string().min(1, "Informe o tempo de estudo."),
  date: z.date({ required_error: "A data é obrigatória." }),
  topic: z.string().min(3, "O tema deve ter pelo menos 3 caracteres."),
  notes: z.string().optional(),
});

export type StudyFormValues = z.infer<typeof studySchema>;

export function useStudyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const dateParam = searchParams.get("date");

  const { disciplines } = useDisciplines();
  const { createStudy, updateStudy, isCreating, isUpdating } = useStudies();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingStudy, setIsLoadingStudy] = useState(false);

  const form = useForm<StudyFormValues>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      disciplineId: "",
      timeSpent: "01:00",
      topic: "",
      notes: "",
      date: dateParam ? normalizeDate(dateParam) : new Date(),
    },
  });

  useEffect(() => {
    const loadStudyForEdit = async () => {
      if (!editId) return;

      setIsLoadingStudy(true);
      try {
        const response = await getStudies();

        const studyToEdit = response.data.find((s) => {
          return String(s.id) === String(editId);
        });

        if (studyToEdit) {
          const formData = {
            disciplineId: String(studyToEdit.disciplineId),
            timeSpent: studyToEdit.timeSpent,
            date: normalizeDate(studyToEdit.date),
            topic: studyToEdit.topic,
            notes: studyToEdit.notes || "",
          };

          form.reset(formData);
        } else {
          toast.error("Estudo não encontrado", {
            description: `Não foi possível encontrar o estudo com ID ${editId}`,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar estudo:", error);
        toast.error("Erro ao carregar estudo", {
          description: "Não foi possível carregar os dados do estudo.",
        });
      } finally {
        setIsLoadingStudy(false);
      }
    };

    loadStudyForEdit();
  }, [editId, form]);

  const onSubmit = (data: StudyFormValues) => {
    const disciplineExists = disciplines.some(
      (d) => d.id === data.disciplineId
    );

    if (!disciplineExists) {
      toast.error("Disciplina inválida", {
        description: "Por favor, selecione uma disciplina válida.",
      });
      return;
    }

    const payload = {
      disciplineId: Number(data.disciplineId),
      timeSpent: data.timeSpent,
      date: formatDateForStorage(data.date),
      topic: data.topic,
      notes: data.notes || "",
    };

    if (editId) {
      updateStudy(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            setSuccessMessage("Registro atualizado com sucesso!");
            setShowSuccess(true);
          },
        }
      );
    } else {
      createStudy(payload, {
        onSuccess: () => {
          setSuccessMessage("Estudo registrado no histórico!");
          setShowSuccess(true);
        },
      });
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/home");
  };

  return {
    form,
    editId,
    onSubmit,
    showSuccess,
    successMessage,
    handleCloseSuccess,
    isEditing: !!editId,
    isSubmitting: isCreating || isUpdating || isLoadingStudy,
    isLoadingStudy,
  };
}
