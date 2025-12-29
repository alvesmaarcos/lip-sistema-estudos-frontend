import { StudyRecord, Review, AlgorithmSettings } from '@/types/study';
import { addDaysToDate, getTodayStr, getDaysDiffFromToday } from './date-utils';


export const timeToDecimal = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
};

export const calculateTotalStudyHours = (records: StudyRecord[]): number => {
  return records.reduce((total, record) => total + timeToDecimal(record.timeSpent), 0);
};


export const createRevisionsForRecord = (
  recordDate: string, 
  settings: AlgorithmSettings
) => {
  return [
    { date: addDaysToDate(recordDate, settings.firstInterval), completed: false },
    { date: addDaysToDate(recordDate, settings.secondInterval), completed: false },
    { date: addDaysToDate(recordDate, settings.thirdInterval), completed: false },
  ];
};

export const createReviewsFromRevisions = (
  studyRecord: StudyRecord, 
  revisions: { date: string, completed: boolean }[]
): Review[] => {
  return revisions.map((rev) => ({
    id: crypto.randomUUID(),
    studyRecordId: studyRecord.id,
    discipline: studyRecord.discipline,
    disciplineColor: studyRecord.disciplineColor,
    topic: studyRecord.topic,
    dueDate: rev.date,
    completed: false,
  }));
};


export const filterOverdueReviews = (reviews: Review[]): Review[] => {
  const todayStr = getTodayStr();
  return reviews
    .filter(r => !r.completed && r.dueDate < todayStr)
    .map(r => ({
      ...r,
      daysOverdue: getDaysDiffFromToday(r.dueDate)
    }));
};

export const filterTodayReviews = (reviews: Review[]): Review[] => {
  const todayStr = getTodayStr();
  return reviews.filter(r => !r.completed && r.dueDate === todayStr);
};

export const filterPendingReviews = (reviews: Review[]): number => {
  const todayStr = getTodayStr();
  return reviews.filter(r => !r.completed && r.dueDate <= todayStr).length;
};