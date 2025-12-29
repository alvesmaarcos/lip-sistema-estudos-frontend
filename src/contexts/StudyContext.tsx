import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import { addDays, format, parseISO, differenceInDays, isToday, isBefore, startOfDay } from 'date-fns';

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

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(DEFAULT_ALGORITHM_SETTINGS);

  useEffect(() => {
    
  }, []);

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

  const getTotalHours = () => 42;
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