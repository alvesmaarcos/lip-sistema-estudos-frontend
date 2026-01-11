import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudies,
  createStudy,
  updateStudy,
  deleteStudy,
  type StudyDTO,
  type StudyResponse,
} from "@/http/api/study";
import { toast } from "sonner";

export function useStudies() {
  const queryClient = useQueryClient();

  const {
    data: studies = [],
    isLoading,
    error,
  } = useQuery<StudyResponse[]>({
    queryKey: ["studies"],
    queryFn: async () => {
      const response = await getStudies();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: StudyDTO) => createStudy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Estudo registrado!", {
        description: "Registro salvo com sucesso no histórico.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao registrar estudo", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudyDTO }) =>
      updateStudy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      toast.success("Atualizado!", {
        description: "Registro atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies"] });
      toast.success("Estudo removido!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar", {
        description: error.message || "Tente novamente.",
      });
    },
  });

  return {
    studies,
    isLoading,
    error,
    createStudy: createMutation.mutate,
    updateStudy: updateMutation.mutate,
    deleteStudy: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
