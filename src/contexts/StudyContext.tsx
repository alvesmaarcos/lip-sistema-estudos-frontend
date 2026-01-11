/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import {
  StudyRecord,
  Review,
  AlgorithmSettings,
  DEFAULT_ALGORITHM_SETTINGS,
} from "@/types/study";
import * as Logic from "@/lib/study-logic";
import { getTodayStr } from "@/lib/date-utils";
import { MOCK_STUDIES, MOCK_REVIEWS } from "@/lib/mocks";
import { generateId } from "@/lib/utils";

interface StudyContextType {
  studyRecords: StudyRecord[];
  reviews: Review[];
  algorithmSettings: AlgorithmSettings;
  overdueCount: number;
  todayReviews: Review[];
  totalHours: number;
  reviewsCompletedCount: number;
  pendingReviewsCount: number;
  addStudyRecord: (
    record: Omit<StudyRecord, "id" | "createdAt" | "revisions">
  ) => StudyRecord;
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
  STUDIES: "study-manager:studies",
  REVIEWS: "study-manager:reviews",
  SETTINGS: "study-manager:settings",
};

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
};

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() =>
    safeLoad(STORAGE_KEYS.STUDIES, MOCK_STUDIES)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    safeLoad(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS)
  );
  const [algorithmSettings, setAlgorithmSettings] = useState<AlgorithmSettings>(
    () => safeLoad(STORAGE_KEYS.SETTINGS, DEFAULT_ALGORITHM_SETTINGS)
  );

  useEffect(
    () =>
      localStorage.setItem(STORAGE_KEYS.STUDIES, JSON.stringify(studyRecords)),
    [studyRecords]
  );
  useEffect(
    () => localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)),
    [reviews]
  );
  useEffect(
    () =>
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(algorithmSettings)
      ),
    [algorithmSettings]
  );

  const addStudyRecord = (
    recordData: Omit<StudyRecord, "id" | "createdAt" | "revisions">
  ): StudyRecord => {
    const savedRecord: StudyRecord = {
      ...recordData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      revisions: [],
    };
    setStudyRecords((prev) => [...prev, savedRecord]);
    return savedRecord;
  };

  const updateStudyRecord = (id: string, updatedData: Partial<StudyRecord>) => {
    setStudyRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updatedData } : record
      )
    );
  };

  const toggleReviewComplete = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          const isCompleting = !review.completed;
          return {
            ...review,
            completed: isCompleting,
            completedAt: isCompleting ? getTodayStr() : undefined,
          };
        }
        return review;
      })
    );
  };

  const updateAlgorithmSettings = (settings: AlgorithmSettings) =>
    setAlgorithmSettings(settings);

  const getOverdueReviews = () => Logic.filterOverdueReviews(reviews);
  const getTodayReviews = () => Logic.filterTodayReviews(reviews);
  const getCompletedReviews = () => reviews.filter((r) => r.completed);

  const totalHours = useMemo(
    () => Logic.calculateTotalStudyHours(studyRecords),
    [studyRecords]
  );
  const reviewsCompletedCount = useMemo(
    () => reviews.filter((r) => r.completed).length,
    [reviews]
  );
  const pendingReviewsCount = useMemo(
    () => Logic.filterPendingReviews(reviews),
    [reviews]
  );
  const overdueCount = useMemo(
    () => Logic.filterOverdueReviews(reviews).length,
    [reviews]
  );
  const todayReviewsList = useMemo(
    () => Logic.filterTodayReviews(reviews),
    [reviews]
  );

  return (
    <StudyContext.Provider
      value={{
        studyRecords,
        reviews,
        algorithmSettings,
        overdueCount,
        todayReviews: todayReviewsList,
        totalHours,
        reviewsCompletedCount,
        pendingReviewsCount,
        addStudyRecord,
        updateStudyRecord,
        toggleReviewComplete,
        updateAlgorithmSettings,
        getOverdueReviews,
        getTodayReviews,
        getCompletedReviews,
        getTotalHours: () => totalHours,
        getReviewsCompleted: () => reviewsCompletedCount,
        getPendingReviews: () => pendingReviewsCount,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined)
    throw new Error("useStudy must be used within a StudyProvider");
  return context;
}
