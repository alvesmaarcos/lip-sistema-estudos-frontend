export interface Review {
  id: string;
  studyRecordId: string;
  userId: number;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  dueDate: string;
  revisionNumber: number;
  interval: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CreateReviewDTO {
  studyRecordId: string;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  dueDate: string;
  revisionNumber: number;
  interval: number;
}

export interface ReviewStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byRevision: {
    revision1: number;
    revision2: number;
    revision3: number;
  };
}
