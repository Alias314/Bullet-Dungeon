import { create } from "zustand";
import { EnemyBullet } from "../../Characters/Bullet";

export const usePoolStore = create((set, get) => ({
  playerBullets: [],
  enemyBullets: [],

  initializeBulletPool: (amount) => {
    const bullets = Array.from({ length: amount }, (_, i) => ({
      id: i,
      active: false,
      position: [0, 0, 0],
      velocity: { x: 0, y: 0, z: 0 },
    }));
    set({ playerBullets: bullets });
  },

  getAvailablePlayerBullet: () => {
    const bullet = get().playerBullets;
    return bullet.findIndex((bullet) => !bullet.active);
  },

  getAvailableEnemyBullet: () => {
    const bullet = get().enemyBullets;
    return bullet.findIndex((bullet) => !bullet.active);
  },

  activatePlayerBullet: (id, position, velocity) => {
    const bullet = get().playerBullets;
    bullet[id] = {
      ...bullet[id],
      active: true,
      position: position,
      velocity: velocity,
    };
    set({ playerBullets: [...bullet] });
  },

  activateEnemyBullet: (id, position, velocity) => {
    const bullet = get().enemyBullets;
    bullet[id] = {
      ...bullet[id],
      active: true,
      position: position,
      velocity: velocity,
    };
    set({ enemyBullets: [...bullet] });
  },

  deactivatePlayerBullet: (id) => {
    const bullet = get().playerBullets;
    bullet[id] = {
      ...bullet[id],
      active: false,
      position: [0, 0, 0],
      velocity: { x: 0, y: 0, z: 0 },
    };
    set({ playerBullets: [...bullet] });
  },

  deactivateEnemyBullet: (id) => {
    const bullet = get().enemyBullets;
    bullet[id] = {
      ...bullet[id],
      active: false,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
    };
    set({ enemyBullets: [...bullet] });
  },
}));
