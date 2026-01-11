import { api } from "./index";

export interface DisciplineDTO {
  id?: string;
  name: string;
  color: string;
}

export async function getDisciplines() {
  return api.get<DisciplineDTO[]>("/disciplines");
}

export async function createDiscipline(data: DisciplineDTO) {
  return api.post<DisciplineDTO>("/disciplines", data);
}

export async function updateDiscipline(id: string, data: DisciplineDTO) {
  return api.put<DisciplineDTO>(`/disciplines/${id}`, data);
}

export async function deleteDiscipline(id: string) {
  return api.delete(`/disciplines/${id}`);
}
