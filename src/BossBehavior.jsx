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
