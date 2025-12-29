import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import { addDays, format, differenceInDays, isToday, isBefore, startOfDay, subDays } from 'date-fns';

// --- MOCK DATA ---
const TODAY = new Date();
const YESTERDAY = subDays(TODAY, 1);

const MOCK_STUDIES: StudyRecord[] = [
  {
    id: '1',
    discipline: 'Engenharia de Software',
    disciplineColor: 'purple',
    topic: 'Padrões de Projeto (MVC, Singleton)',
    timeSpent: '02:00',
    date: format(TODAY, 'yyyy-MM-dd'), 
    createdAt: new Date().toISOString(),
    revisions: [],
    notes: 'Revisar implementação em Java'
  },
  {
    id: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    timeSpent: '01:30',
    date: format(TODAY, 'yyyy-MM-dd'), 
    createdAt: new Date().toISOString(),
    revisions: [],
  },
  {
    id: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    timeSpent: '03:00',
    date: format(YESTERDAY, 'yyyy-MM-dd'), 
    createdAt: new Date().toISOString(),
    revisions: [],
  },
  {
    id: '4',
    discipline: 'Estrutura de Dados',
    disciplineColor: 'red',
    topic: 'Árvores Binárias de Busca',
    timeSpent: '01:00',
    date: format(addDays(TODAY, 1), 'yyyy-MM-dd'),
    createdAt: new Date().toISOString(),
    revisions: [],
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    studyRecordId: '3',
    discipline: 'Inteligência Artificial',
    disciplineColor: 'navy',
    topic: 'Redes Neurais - Perceptron',
    dueDate: format(subDays(TODAY, 1), 'yyyy-MM-dd'),
    completed: false,
  },
  {
    id: 'r2',
    studyRecordId: '2',
    discipline: 'Banco de Dados',
    disciplineColor: 'blue',
    topic: 'Normalização e Formas Normais',
    dueDate: format(TODAY, 'yyyy-MM-dd'),
    completed: false,
  }
];
// --- FIM MOCK DATA ---

interface StudyContextType {
  studyRecords: StudyRecord[];
  reviews: Review[];
  algorithmSettings: AlgorithmSettings;
  addStudyRecord: (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>) => StudyRecord;
  updateStudyRecord: (id: string, record: Partial<StudyRecord>) => void;
  toggleReviewComplete: (reviewId: string) => void;
  updateAlgorithmSettings: (settings: AlgorithmSettings) => void;
  getOverdueReviews: () => Review[];
  getTodayReviews: () => Review[];
  getCompletedReviews: () => Review[];
  getTotalHours: () => number;
  getReviewsCompleted: () => number;
  getPendingReviews: () => number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Função auxiliar para somar horas "HH:MM"
const timeToDecimal = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(MOCK_STUDIES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(DEFAULT_ALGORITHM_SETTINGS);

  const addStudyRecord = (record: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
    const baseDate = new Date(record.date.replace(/-/g, '/'));
    const revisions = [
      { date: format(addDays(baseDate, algorithmSettings.firstInterval), 'yyyy-MM-dd'), completed: false },
      { date: format(addDays(baseDate, algorithmSettings.secondInterval), 'yyyy-MM-dd'), completed: false },
      { date: format(addDays(baseDate, algorithmSettings.thirdInterval), 'yyyy-MM-dd'), completed: false },
    ];

    const newRecord: StudyRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      revisions,
    };

    setStudyRecords(prev => [...prev, newRecord]);

    const newReviews: Review[] = revisions.map((rev) => ({
      id: crypto.randomUUID(),
      studyRecordId: newRecord.id,
      discipline: record.discipline,
      disciplineColor: record.disciplineColor,
      topic: record.topic,
      dueDate: rev.date,
      completed: false,
    }));

    setReviews(prev => [...prev, ...newReviews]);
    return newRecord;
  };

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedData } : record
    ));


    setReviews(prev => prev.map(review => {
      if (review.studyRecordId === id) {
        return {
          ...review,
          topic: updatedData.topic || review.topic,
          discipline: updatedData.discipline || review.discipline,
          disciplineColor: updatedData.disciplineColor || review.disciplineColor
        };
      }
      return review;
    }));
  };

  const toggleReviewComplete = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          completed: !review.completed,
          completedAt: !review.completed ? format(new Date(), 'yyyy-MM-dd') : undefined,
        };
      }
      return review;
    }));
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => setAlgorithmSettings(settings);

  const getOverdueReviews = () => {
    const today = startOfDay(new Date());
    return reviews
      .filter(r => !r.completed && isBefore(new Date(r.dueDate.replace(/-/g, '/')), today))
      .map(r => ({ ...r, daysOverdue: differenceInDays(today, new Date(r.dueDate.replace(/-/g, '/'))) }));
  };

  const getTodayReviews = () => {
    return reviews.filter(r => !r.completed && isToday(new Date(r.dueDate.replace(/-/g, '/'))));
  };

  const getCompletedReviews = () => reviews.filter(r => r.completed);

  const getTotalHours = () => {
      return studyRecords.reduce((total, record) => {
        return total + timeToDecimal(record.timeSpent);
      }, 0);
  };
  
  const getReviewsCompleted = () => reviews.filter(r => r.completed).length;
  const getPendingReviews = () => reviews.filter(r => !r.completed).length;

  return (
    <StudyContext.Provider value={{
      studyRecords,
      reviews,
      algorithmSettings,
      addStudyRecord,
      updateStudyRecord,
      toggleReviewComplete,
      updateAlgorithmSettings,
      getOverdueReviews,
      getTodayReviews,
      getCompletedReviews,
      getTotalHours,
      getReviewsCompleted,
      getPendingReviews,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}