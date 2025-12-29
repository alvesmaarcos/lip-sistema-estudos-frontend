import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import { subDays, format } from 'date-fns'; 
import * as Logic from '@/lib/study-logic';
import { getTodayStr } from '@/lib/date-utils'; 
import { MOCK_STUDIES, MOCK_REVIEWS } from '@/lib/mocks';
import { generateId } from '@/lib/utils';

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

const STORAGE_KEYS = {
  STUDIES: 'study-manager:studies',
  REVIEWS: 'study-manager:reviews',
  SETTINGS: 'study-manager:settings',
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDIES);
    return saved ? JSON.parse(saved) : MOCK_STUDIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_ALGORITHM_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studyRecords));
  }, [studyRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(algorithmSettings));
  }, [algorithmSettings]);


  const addStudyRecord = (recordData: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
    const revisionsRef = Logic.createRevisionsForRecord(recordData.date, algorithmSettings);

    const newRecord: StudyRecord = {
      ...recordData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      revisions: revisionsRef,
    };

    const newReviews = Logic.createReviewsFromRevisions(newRecord, revisionsRef);

    setStudyRecords(prev => [...prev, newRecord]);
    setReviews(prev => [...prev, ...newReviews]);
    
    return newRecord;
  };

 const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
  setStudyRecords(prev => prev.map(record => {
    if (record.id === id) {
      const newRecord = { ...record, ...updatedData };
      
      // [LOGICA NOVA] Se a data mudou, precisamos regenerar as revisões
      if (updatedData.date && updatedData.date !== record.date) {
        const newRevisions = Logic.createRevisionsForRecord(updatedData.date, algorithmSettings);
        newRecord.revisions = newRevisions;

        // Atualiza a lista global de reviews (objetos de interface)
        setReviews(prevReviews => {
          // Remove as reviews antigas deste estudo
          const otherReviews = prevReviews.filter(r => r.studyRecordId !== id);
          // Cria as novas baseadas na nova data
          const freshReviews = Logic.createReviewsFromRevisions(newRecord, newRevisions);
          return [...otherReviews, ...freshReviews];
        });
      }
      
      return newRecord;
    }
    return record;
  }));

  if (!updatedData.date) {
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
  }
};

  const toggleReviewComplete = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const isCompleting = !review.completed;
        return {
          ...review,
          completed: isCompleting,
          completedAt: isCompleting ? getTodayStr() : undefined,
        };
      }
      return review;
    }));
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => setAlgorithmSettings(settings);

  // --- Getters ---
  const getOverdueReviews = () => Logic.filterOverdueReviews(reviews);
  const getTodayReviews = () => Logic.filterTodayReviews(reviews);
  const getCompletedReviews = () => reviews.filter(r => r.completed);
  const getPendingReviews = () => Logic.filterPendingReviews(reviews);
  const getTotalHours = () => Logic.calculateTotalStudyHours(studyRecords);
  const getReviewsCompleted = () => reviews.filter(r => r.completed).length;

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