import { usePlayerStore } from "./usePlayerStore";
import { usePoolStore } from "./usePoolStore";
import { Vector3 } from "three";
import { delay } from "../../Utils/Helper";

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

export const enemySpreadShoot = (
  playerPos,
  enemyPos,
  position,
  bulletSpeed,
  amountBullets,
  getAvailableEnemyBullet,
  activateEnemyBullet
) => {
  for (let i = 0; i < amountBullets; i++) {
    const angleOffset = Math.sin(i / 5) - 0.4;
    const direction = new Vector3(
      playerPos.x - enemyPos.x,
      0,
      playerPos.z - enemyPos.z
    )
      .applyAxisAngle(new Vector3(0, 1, 0), angleOffset)
      .normalize();
    const velocity = {
      x: direction.x * bulletSpeed,
      y: 0,
      z: direction.z * bulletSpeed,
    };

    enemySingleShoot(
      position,
      velocity,
      getAvailableEnemyBullet,
      activateEnemyBullet
    );
  }
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

export async function radialBarrageShoot(
  position,
  bulletSpeed,
  amountBullets,
  amountBarrage,
  getAvailableEnemyBullet,
  activateEnemyBullet
) {
  for (let i = 0; i < amountBarrage; i++) {
    await delay(150);

    for (let j = 0; j < amountBullets; j++) {
      const offset = (i % 2) * (Math.PI / amountBullets);
      const angle = (j / amountBullets) * Math.PI * 2 + i + offset;
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
}
