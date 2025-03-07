import { Vector3 } from "three";


export function dash(playerPos, enemyPos) {
  const velocity = {
    x: 0,
    y: 0,
    z: 0,
  };
  const speed = 10;

  if (playerPos.x < enemyPos.x) velocity.x = -speed;
  if (playerPos.x > enemyPos.x) velocity.x = speed;
  if (playerPos.z < enemyPos.z) velocity.z = -speed;
  if (playerPos.z > enemyPos.z) velocity.z = speed;

  return velocity;
}

export function radialBullet(enemyPos, setEnemyBullets, bulletSpeed, amountBullets) {
  for (let i = 0; i < amountBullets; i++) {
    const angle = (i / amountBullets) * Math.PI * 2;
    const direction = new Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();

    const velocity = {
      x: direction.x * bulletSpeed,
      y: direction.y * bulletSpeed,
      z: direction.z * bulletSpeed,
    };

    setEnemyBullets((prev) => [
      ...prev,
      {
        id: Math.random(),
        position: [enemyPos.x, 1, enemyPos.z],
        velocity,
      },
    ]);
  }
}