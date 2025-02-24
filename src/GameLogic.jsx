export const handleRemoveBullet = (bulletId) => {
  setBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
};

export const handleRemoveEnemy = (enemyId) => {
  if (amountEnemy > 0) {
    setAmountEnemy((prev) => prev - 1);
  }

  setEnemies((prev) => prev.filter((enemy) => enemy.id !== enemyId));
};

const handleBulletCollision = (manifold, target, other, bulletId) => {
  if (
    other.rigidBodyObject &&
    other.rigidBodyObject.name &&
    other.rigidBodyObject.name.startsWith("Enemy-")
  ) {
    const enemyId = parseInt(other.rigidBodyObject.name.split("-")[1]);
    handleRemoveEnemy(enemyId);
  }

  if (
    other.rigidBodyObject.name !== "Bullet" &&
    other.rigidBodyObject.name !== "Player"
  ) {
    handleRemoveBullet(bulletId);
  }
};
