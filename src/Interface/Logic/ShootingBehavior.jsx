import { usePlayerStore } from "./usePlayerStore";
import { usePoolStore } from "./usePoolStore";
import { Vector3 } from "three";

export const playerSingleShoot = (
  position,
  velocity,
  getAvailablePlayerBullet,
  activatePlayerBullet
) => {
  const id = getAvailablePlayerBullet();
  activatePlayerBullet(id, position, velocity);
};

export const playerSpreadShoot = (
  amountBullets,
  position,
  bulletSpeed,
  playerDirectionRef,
  getAvailablePlayerBullet,
  activatePlayerBullet
) => {
  for (let i = 0; i < amountBullets; i++) {
    const angleOffset = Math.sin(i / 5) - 0.4;
    const direction = new Vector3(
      playerDirectionRef.current.x,
      0,
      playerDirectionRef.current.z
    )
      .applyAxisAngle(new Vector3(0, 1, 0), angleOffset)
      .normalize();
    const velocity = {
      x: direction.x * bulletSpeed,
      y: 0,
      z: direction.z * bulletSpeed,
    };

    playerSingleShoot(
      position,
      velocity,
      getAvailablePlayerBullet,
      activatePlayerBullet
    );
  }
};

export const enemySingleShoot = (
  position,
  velocity,
  getAvailableEnemyBullet,
  activateEnemyBullet
) => {
  const id = getAvailableEnemyBullet();
  activateEnemyBullet(id, position, velocity);
};

export async function enemyRadialShoot(
  position,
  bulletSpeed,
  amountBullets,
  getAvailableEnemyBullet,
  activateEnemyBullet
) {
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

    enemySingleShoot(
      position,
      velocity,
      getAvailableEnemyBullet,
      activateEnemyBullet
    );
  }
}
