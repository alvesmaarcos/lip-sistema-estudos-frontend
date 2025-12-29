import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudyRecord, Review, AlgorithmSettings, DEFAULT_ALGORITHM_SETTINGS } from '@/types/study';
import * as Logic from '@/lib/study-logic';
import { getTodayStr as getToday } from '@/lib/date-utils'; 
import { MOCK_STUDIES, MOCK_REVIEWS } from '@/lib/mocks'; 

// --- MOCK DATA ---
// (Mantenha seus mocks aqui como estavam, ou mova para um arquivo separado mocks.ts para limpar ainda mais)
// Para economizar espaço na resposta, vou assumir que você manteve o bloco "MOCK DATA" aqui.
// ... [SEUS MOCKS AQUI] ...
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

export function StudyProvider({ children }: { children: ReactNode }) {
  // Nota: Idealmente moveríamos MOCK_STUDIES para fora ou para um initial state
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(MOCK_STUDIES); 
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(DEFAULT_ALGORITHM_SETTINGS);

  const addStudyRecord = (recordData: Omit<StudyRecord, 'id' | 'createdAt' | 'revisions'>): StudyRecord => {
    // 1. Gera as datas de revisão usando a Lógica Pura
    const revisionsRef = Logic.createRevisionsForRecord(recordData.date, algorithmSettings);

    // 2. Cria o objeto do estudo
    const newRecord: StudyRecord = {
      ...recordData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      revisions: revisionsRef,
    };

    // 3. Gera os objetos de Review para o calendário/dashboard
    const newReviews = Logic.createReviewsFromRevisions(newRecord, revisionsRef);

    // 4. Atualiza o estado
    setStudyRecords(prev => [...prev, newRecord]);
    setReviews(prev => [...prev, ...newReviews]);
    
    return newRecord;
  };

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedData } : record
    ));
    
    // Atualiza reviews associadas se mudar tópico/disciplina
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
        const isCompleting = !review.completed;
        return {
          ...review,
          completed: isCompleting,
          completedAt: isCompleting ? getToday() : undefined,
        };
      }
      return review;
    }));
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) => setAlgorithmSettings(settings);

  // --- Getters (Agora delegam para Logic) ---
  
  const getOverdueReviews = () => Logic.filterOverdueReviews(reviews);
  
  const getTodayReviews = () => Logic.filterTodayReviews(reviews);
  
  const getCompletedReviews = () => reviews.filter(r => r.completed); // Simples o suficiente para ficar aqui ou mover
  
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