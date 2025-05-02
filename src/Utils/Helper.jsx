export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getRandomPosition = (roomDimensions, position) => {
  const margin = 5;
  const x =
    Math.random() * (roomDimensions[0] - 2 * margin) -
    (roomDimensions[0] - 2 * margin) / 2 +
    position[0];
  const y = 1.2;
  const z =
    Math.random() * (roomDimensions[2] - 2 * margin) -
    (roomDimensions[2] - 2 * margin) / 2 +
    position[2];
  return [x, y, z];
};

const distanceBetween = (posA, posB) => {
  const dx = posA[0] - posB[0];
  const dy = posA[1] - posB[1];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const summonEnemies = (roomDimensions, position, setAmountEnemy) => {
  const enemyList = [];
  const amountEnemy = Math.max(Math.random() * 12, 6);
  // const amountEnemy = 1;
  const minDistance = 2;
  const maxAttempts = 20;

  for (let i = 0; i < amountEnemy; i++) {
    let candidatePos;
    let attempts = 0;

    do {
      candidatePos = getRandomPosition(roomDimensions, position);
      attempts++;
      if (attempts >= maxAttempts) break;
    } while (
      enemyList.some(
        (enemy) => distanceBetween(enemy.position, candidatePos) < minDistance
      )
    );
    
    const randomValue = Math.random();
    let type;
    if (randomValue <= 0.3) {
      type = "melee";
    } else if (randomValue <= 0.6) {
      type = "pistol";
    } else if (randomValue <= 0.8) {
      type = "gatling";
    } else {
      type = "torus";
    }

    // type = "torus";
    enemyList.push({
      id: i,
      type,
      health: 30,
      position: candidatePos,
      showIndicator: false,
    });
  }
  setAmountEnemy(amountEnemy);
  return enemyList;
};
