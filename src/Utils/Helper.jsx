export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getRandomPosition = (roomDimensions, position) => {
  const margin = 5;
  const x =
    Math.random() * (roomDimensions[0] - 2 * margin) -
    (roomDimensions[0] - 2 * margin) / 2 +
    position[0];
  const y = 1;
  const z =
    Math.random() * (roomDimensions[2] - 2 * margin) -
    (roomDimensions[2] - 2 * margin) / 2 +
    position[2];
  return [x, y, z];
};

export const summonEnemies = (roomDimensions, position, setAmountEnemy) => {
  const enemyList = [];
  const amountEnemy = Math.max(Math.random() * 12, 7);
  // const amountEnemy = 0;

  for (let i = 0; i < amountEnemy; i++) {
    const randomValue = Math.random();
    let type;
    if (randomValue < 0.4) {
      type = "melee";
    } else if (randomValue < 0.8) {
      type = "pistol";
    } else {
      type = "gatling";
    }
    enemyList.push({
      id: i,
      type,
      health: 30,
      position: getRandomPosition(roomDimensions, position),
      showIndicator: false,
    });
  }
  setAmountEnemy(amountEnemy);
  return enemyList;
};
