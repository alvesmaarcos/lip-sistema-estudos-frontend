export interface StudyRecord {
  id: string;
  discipline: string;
  disciplineColor: DisciplineColor;
  timeSpent: string;
  date: string;
  topic: string;
  notes?: string;
  createdAt: string;
  revisions: RevisionDate[];
}

export interface RevisionDate {
  date: string;
  completed: boolean;
  completedAt?: string;
}

export interface Review {
  id: string;
  studyRecordId: string;
  discipline: string;
  disciplineColor: DisciplineColor;
  topic: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  daysOverdue?: number;
}

export type DisciplineColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'navy';

export interface Discipline {
  id: string;
  name: string;
  color: DisciplineColor;
}

export const DISCIPLINES: Discipline[] = [
  { id: '1', name: 'Engenharia de Software', color: 'purple' },
  { id: '2', name: 'Banco de Dados', color: 'blue' },
  { id: '3', name: 'Inteligência Artificial', color: 'navy' },
  { id: '4', name: 'Redes de Computadores', color: 'green' },
  { id: '5', name: 'Estrutura de Dados', color: 'red' },
  { id: '6', name: 'Java / POO', color: 'orange' },
];

export interface AlgorithmSettings {
  firstInterval: number;
  secondInterval: number;
  thirdInterval: number;
}

export const DEFAULT_ALGORITHM_SETTINGS: AlgorithmSettings = {
  firstInterval: 1,
  secondInterval: 7,
  thirdInterval: 30,
};


