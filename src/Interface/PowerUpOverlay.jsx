import { useEffect, useState } from "react";
import PowerUpCard from "./PowerUpCard";
import { Vector3 } from "three";

export default function PowerUpOverlay({
  displayPowerUpOverlay,
  setDashBar,
  dashCooldown,
  maxDashBar,
  setPlayerBullets,
  playerRef,
  setDashShield
}) {
  const ninja = () => {
    setDashBar(4);
    dashCooldown.current = 500;
    maxDashBar.current = 4;
    closeOverlay();
  };

  const radialBullet = () => {
    const bulletSpeed = 25;
    const amountBullets = 16;

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

    closeOverlay();
    return () => clearInterval(interval);
  };

  const closeOverlay = () => {
    displayPowerUpOverlay(false);
  };

  const dashShield = () => {
    setDashShield(true);
    closeOverlay()
  };

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
    drone: {
      title: "Drone",
      description: "Summons a drone that fights for you",
      image: "delivery-drone.svg",
      onSelectFunction: radialBullet,
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

  const keys = Object.keys(powerUps);
  const [isUsedKey, setIsUsedKey] = useState({});
  let randomKey = keys[Math.floor(Math.random() * keys.length)];

  while (Object.keys(isUsedKey).length < 4) {
    if (isUsedKey[randomKey]) {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
    } else {
      isUsedKey[randomKey] = 1;
    }
  }

  const [amountReroll, setAmountReroll] = useState(3);
  const reroll = () => {
    if (amountReroll > 0) {
      setIsUsedKey({});
      setAmountReroll(prev => prev - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-10 opacity-90">
      <h2 className="text-5xl text-white font-bold mb-4">Choose Power Up</h2>
      <div className="flex gap-10 text-black">
        {Object.keys(isUsedKey).map((key) => (
          <PowerUpCard
            title={powerUps[key].title}
            description={powerUps[key].description}
            image={powerUps[key].image}
            onSelectFunction={powerUps[key].onSelectFunction}
          />
        ))}
      </div>

      <button onClick={reroll} className="px-6 py-2 bg-white text-5xl font-semibold rounded-2xl hover:bg-gray-400">
        Reroll ({amountReroll})
      </button>
    </div>
  );
}
