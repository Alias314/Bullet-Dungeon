import { create } from "zustand";

export const useGameStore = create((set) => ({
  isGameRunning: true,
  isDamaged: false,

  setIsGameRunning: (value) => set({isGameRunning: value}),
  setIsDamaged: (value) => set({isDamaged: value}),
}));
