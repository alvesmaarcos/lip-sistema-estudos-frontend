/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Discipline } from "@/types/study";
import {
  getDisciplines,
  createDiscipline as apiCreateDiscipline,
  updateDiscipline as apiUpdateDiscipline,
  deleteDiscipline as apiDeleteDiscipline,
  DisciplineDTO,
} from "@/http/api/discipline";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { generateId } from "@/lib/utils";
import { useCallback } from "react";

interface DisciplineContextType {
  disciplines: Discipline[];
  isLoading: boolean;
  addDiscipline: (discipline: Omit<Discipline, "id">) => Promise<void>;
  updateDiscipline: (id: string, updates: Partial<Discipline>) => Promise<void>;
  deleteDiscipline: (id: string) => Promise<void>;
  refreshDisciplines: () => Promise<void>;
}

const DisciplineContext = createContext<DisciplineContextType | undefined>(
  undefined
);

export function DisciplineProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDisciplines = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      const response = await getDisciplines();

      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      const backendDisciplines = data.map((d: DisciplineDTO) => ({
        id: String(d.id ?? generateId()),
        name: d.name,
        color: d.color || "blue",
      }));

      setDisciplines(backendDisciplines);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDisciplines();
    }
  }, [isAuthenticated, token, fetchDisciplines]);

  const addDiscipline = async (discipline: Omit<Discipline, "id">) => {
    if (!token) return;

    try {
      await apiCreateDiscipline({
        name: discipline.name,
        color: discipline.color,
      });

      await fetchDisciplines();
      toast.success("Disciplina criada com sucesso!");
    } catch {
      toast.error("Erro ao criar disciplina");
    }
  };

  const updateDiscipline = async (id: string, updates: Partial<Discipline>) => {
    if (!token || !updates.name) return;

    try {
      await apiUpdateDiscipline(id, {
        name: updates.name,
        color: updates.color || "blue",
      });

      await fetchDisciplines();
      toast.success("Disciplina atualizada!");
    } catch {
      toast.error("Erro ao atualizar disciplina");
    }
  };

  const deleteDiscipline = async (id: string) => {
    if (!token) return;

    try {
      await apiDeleteDiscipline(id);
      await fetchDisciplines();
      toast.success("Disciplina removida!");
    } catch {
      toast.error("Erro ao remover disciplina");
    }
  };

  return (
    <DisciplineContext.Provider
      value={{
        disciplines,
        isLoading,
        addDiscipline,
        updateDiscipline,
        deleteDiscipline,
        refreshDisciplines: fetchDisciplines,
      }}
    >
      {children}
    </DisciplineContext.Provider>
  );
}

export function useDisciplines() {
  const context = useContext(DisciplineContext);
  if (!context) {
    throw new Error("useDisciplines must be used within a DisciplineProvider");
  }
  return context;
}
