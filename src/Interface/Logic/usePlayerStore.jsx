import { create } from "zustand";

const initialStats = {
  level: 0,
  xp: 0,
  health: 10000,
  hpRegeneration: 0,
  lifeSteal: 0,
  damage: 0,
  attackSpeed: 0,
  armor: 0,
  dodge: 0,
  speed: 8,
  dashes: 2,
  maxDashes: 2,
  dashForce: 20,
  dashDuration: 200,
  dashCooldown: 1000,
};

export const usePlayerStore = create((set) => ({
  playerRef: null,
  isDashing: false,
  stats: {
    ...initialStats,
  },

  increaseStat: (stat, amount) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [stat]: state.stats[stat] + amount,
      },
    })),

  setStat: (stat, amount) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [stat]: amount,
      },
    })),

  resetStats: () => set({ stats: { ...initialStats } }),
  setPlayerRef: (ref) => set({ playerRef: ref }),
  setIsDashing: (value) => set({isDashing: value}),
}));
