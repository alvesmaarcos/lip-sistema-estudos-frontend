import { format, addDays, differenceInDays, parseISO } from 'date-fns';

export const DATE_FORMAT_DB = 'yyyy-MM-dd';

export const getTodayStr = () => format(new Date(), DATE_FORMAT_DB);

export const normalizeDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  return new Date(dateStr.replace(/-/g, '/'));
};

export const formatDateForStorage = (date: Date) => format(date, DATE_FORMAT_DB);

export const addDaysToDate = (dateStr: string, days: number): string => {
  const date = normalizeDate(dateStr);
  return format(addDays(date, days), DATE_FORMAT_DB);
};

export const getDaysDiffFromToday = (dateStr: string): number => {
  const targetDate = normalizeDate(dateStr);
  const today = new Date();
  return differenceInDays(today, targetDate);
};