import { usePowerUpStore } from "./usePowerUpStore";
import { usePlayerStore } from "./usePlayerStore";
import { useEffect } from "react";
import { Vector3 } from "three";
import { playerSingleShoot } from "./ShootingBehavior";
import { usePoolStore } from "./usePoolStore";

export function Ninja() {
  const setStat = usePlayerStore((state) => state.setStat);
  const powerUps = usePowerUpStore((state) => state.powerUps);

  useEffect(() => {
    if (powerUps["ninja"]) {
      setStat("dashes", 4);
      setStat("maxDashes", 4);
      setStat("dashCooldown", 500);
    }
    else {
      setStat("dashes", 2);
      setStat("maxDashes", 2);
      setStat("dashCooldown", 1000);
    }
  }, [powerUps["ninja"]]);

  return null;
}

export function RadialBullet({ bulletSpeed, amountBullets }) {
  const playerRef = usePlayerStore((state) => state.playerRef);
  const powerUps = usePowerUpStore((state) => state.powerUps);
  const getAvailablePlayerBullet = usePoolStore(
    (state) => state.getAvailablePlayerBullet
  );
  const activatePlayerBullet = usePoolStore(
    (state) => state.activatePlayerBullet
  );

  useEffect(() => {
    if (!powerUps["radialBullet"]) return;

    const interval = setInterval(() => {
      const playerPos =
        playerRef && playerRef.current ? playerRef.current.translation() : null;
      const position = [playerPos.x, 1, playerPos.z];
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

        playerSingleShoot(
          position,
          velocity,
          getAvailablePlayerBullet,
          activatePlayerBullet
        );
      }

      console.log(position);
    }, 2000);

    return () => clearInterval(interval);
  }, [powerUps["radialBullet"]]);
  return null;
}
