import { useEffect } from "react";
import PowerUpCard from "./PowerUpCard";
import { Vector3 } from "three";

export default function PowerUpOverlay({
  displayPowerUpOverlay,
  setDashBar,
  dashCooldown,
  maxDashBar,
  setPlayerBullets,
  playerRef,
}) {
  const ninja = () => {
    setDashBar(4);
    dashCooldown.current = 500;
    maxDashBar.current = 4;
    closeOverlay();
  };

  const radialBullet = () => {
    const bulletSpeed = 30;
    const amountBullets = 9;

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
    }, 1000);

    closeOverlay();
    return () => clearInterval(interval);
  };

  const closeOverlay = () => {
    displayPowerUpOverlay(false);
  };

  const powerUps = {
    ninja: {
      title: "Ninja",
      description: "Double the amount of dashes and halves the dash cooldown.",
      onSelectFunction: ninja,
    },
    radialBullet: {
      title: "Radial Bullet",
      description: "Shoot an array of bullets around you at set intervals",
      onSelectFunction: radialBullet,
    },
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 opacity-90">
      <h2 className="text-5xl text-white font-bold mb-8">Choose Power Up</h2>
      <div className="flex gap-10 text-black">
        <PowerUpCard
          title={powerUps.ninja.title}
          description={powerUps.ninja.description}
          onSelectFunction={powerUps.ninja.onSelectFunction}
        />

        <PowerUpCard
          title={powerUps.radialBullet.title}
          description={powerUps.radialBullet.description}
          onSelectFunction={powerUps.radialBullet.onSelectFunction}
        />

        <PowerUpCard
          title={powerUps.ninja.title}
          description={powerUps.ninja.description}
          onSelectFunction={powerUps.ninja.onSelectFunction}
        />
      </div>
    </div>
  );
}
