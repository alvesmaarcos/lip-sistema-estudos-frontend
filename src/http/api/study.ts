import { api } from "./index";

export interface StudyDTO {
  disciplineId: number;
  timeSpent: string;
  date: string;
  topic: string;
  notes?: string;
}

export class CreateStudyDto {
  disciplineId: number;
  timeSpent: string;
  date: string;
  topic: string;
  notes?: string;
  revisionIntervals: number[];
}

export interface StudyResponse {
  id: number;
  disciplineId: number;
  disciplineName: string;
  timeSpent: string;
  date: string;
  topic: string;
  notes?: string;
}

export function createStudy(data: StudyDTO) {
  const userId = localStorage.getItem("userId");

  const payload = {
    disciplineId: data.disciplineId,
    timeSpent: data.timeSpent,
    date: data.date,
    topic: data.topic,
    notes: data.notes || "",
  };

  return api.post<StudyResponse>("/studies", payload, {
    headers: { userId: userId || "" },
  });
}

export function getStudies() {
  const userId = localStorage.getItem("userId");
  return api.get<StudyResponse[]>("/studies", {
    headers: { userId: userId || "" },
  });
}

export function updateStudy(id: string, data: StudyDTO) {
  const userId = localStorage.getItem("userId");

  const payload = {
    disciplineId: data.disciplineId,
    timeSpent: data.timeSpent,
    date: data.date,
    topic: data.topic,
    notes: data.notes || "",
  };

  return api.put<StudyResponse>(`/studies/${id}`, payload, {
    headers: { userId: userId || "" },
  });
}

export function deleteStudy(id: string) {
  const userId = localStorage.getItem("userId");
  return api.delete(`/studies/${id}`, {
    headers: { userId: userId || "" },
  });
}
