export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getRandomPosition = (roomDimensions, position) => {
  const x = Math.random() * roomDimensions[0] - roomDimensions[0] / 2 + position[0] - 5;
  const y = 1;
  const z = Math.random() * roomDimensions[2] - roomDimensions[2] / 2 + position[2] - 5;
  return [x, y, z];
};

export const summonEnemies = (roomDimensions, position, setAmountEnemy) => {
  const enemyList = [];
  const amountEnemy = 10;

  for (let i = 0; i < amountEnemy; i++) {
    const randomValue = Math.random();
    let type;
    if (randomValue < 0.5) {
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
    });
  }
  setAmountEnemy(amountEnemy);
  return enemyList;
};