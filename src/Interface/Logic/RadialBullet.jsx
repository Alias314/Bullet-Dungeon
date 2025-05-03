import { useEffect } from "react";
import { usePlayerStore } from "./usePlayerStore";
import { usePowerUpStore } from "./usePowerUpStore";

export default function RadialBullet() {
  const isActive = usePowerUpStore((state) => state.RadialBullet);
  const playerRef = usePlayerStore((state) => state.playerRef);

  useEffect(() => {
    if (!isActive) return;

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

    return () => clearInterval(interval);
  }, [isActive]);

  return null;
}
