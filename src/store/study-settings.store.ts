import { create } from "zustand";

interface StudySettingsState {
  intervals: number[];
  setIntervals: (intervals: number[]) => void;
}

export const useStudySettingsStore = create<StudySettingsState>((set) => ({
  intervals: [1, 7, 14],
  setIntervals: (intervals) => set({ intervals }),
}));
