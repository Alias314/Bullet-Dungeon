import { create } from "zustand";

const powerUps = {
  ninja: {
    title: "Ninja",
    description: "Double the amount of dashes and halves the dash cooldown.",
    image: "running-ninja.svg",
    onSelectFunction: ninja,
  },
  radialBullet: {
    title: "Radial Bullet",
    description: "Shoot an array of bullets around you every 3 seconds",
    image: "icicles-aura.svg",
    onSelectFunction: radialBullet,
  },
  dashShield: {
    title: "Dash Shield",
    description: "Summons a shield around you when you dash",
    image: "surrounded-shield.svg",
    onSelectFunction: dashShield,
  },
  Enrage: {
    title: "Enrage",
    description: "Increases damage by 30% for 3 seconds if you get damaged",
    image: "enrage.svg",
    onSelectFunction: radialBullet,
  },
  Barbarian: {
    title: "Barbarian",
    description: "Increases damage by 25% but you cannot dash",
    image: "barbarian.svg",
    onSelectFunction: radialBullet,
  },
  fireSilhouette: {
    title: "Fire Silhouette",
    description: "Deals damage to enemies within a certain radius",
    image: "fire-silhouette.svg",
    onSelectFunction: radialBullet,
  },
};

export const usePowerUpStore = create((set) => ({
  dashShield: false,
  ninja: false,
  radialBullet: false,
  enrage: false,
  barbarian: false,
  fireAura: false,
  
}));
