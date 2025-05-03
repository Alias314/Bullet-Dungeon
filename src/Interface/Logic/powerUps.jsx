import { usePowerUpStore } from "./usePowerUpStore";
import { usePlayerStore } from "./usePlayerStore";
import { useEffect } from "react";

export const powerUps = {
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
    onSelectFunction: ninja,
  },
  enrage: {
    title: "Enrage",
    description: "Increases damage by 30% for 3 seconds if you get damaged",
    image: "enrage.svg",
    onSelectFunction: ninja,
  },
  barbarian: {
    title: "Barbarian",
    description: "Increases damage by 25% but you cannot dash",
    image: "barbarian.svg",
    onSelectFunction: ninja,
  },
  fireSilhouette: {
    title: "Fire Silhouette",
    description: "Deals damage to enemies within a certain radius",
    image: "fire-silhouette.svg",
    onSelectFunction: ninja,
  },
};

const ninja = () => {
  const setStat = usePlayerStore((state) => state.setStat);
  setStat("dashes", 4);
  setStat("dashCooldown", 500);
};

const radialBullet = () => {
  const bulletSpeed = 25;
  const amountBullets = 16;
  const playerRef = usePlayerStore((state) => state.playerRef);

  const interval = setInterval(() => {
    const playerPos =
      playerRef && playerRef.current ? playerRef.current.translation() : null;
    for (let i = 0; i < amountBullets; i++) {
      const angle = (i / amountBullets) * Math.PI * 2;
      const direction = new Vector3(
        Math.cos(angle),
        0,
        Math.sin(angle)
      ).normalize();

      const velocity = {
        x: direction.x * bulletSpeed,
        y: direction.y * bulletSpeed,
        z: direction.z * bulletSpeed,
      };

      setPlayerBullets((prev) => [
        ...prev,
        {
          id: Math.random(),
          position: [playerPos.x, 1, playerPos.z],
          velocity,
        },
      ]);
    }
  }, 3000);

  return () => clearInterval(interval);
};
