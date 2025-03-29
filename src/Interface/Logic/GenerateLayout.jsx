export function generateLayout() {
  let layout = [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
  ];
  const startingX = 3;
  const startingY = 3;
  const size = layout.length;
  const maxRooms = 7;
  let amountRooms = 1;
  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  const keys = Object.keys(directions);
  let currentX = startingX;
  let currentY = startingY;

  while (amountRooms <= maxRooms) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomDirection = directions[randomKey];
    currentX += randomDirection[0];
    currentY += randomDirection[1];
    if (
      currentX >= 0 &&
      currentX < size &&
      currentY >= 0 &&
      currentY < size &&
      layout[currentX][currentY] === -1
    ) {
      layout[currentX][currentY] = 1;
      amountRooms++;
    } else if (
      currentX < 0 ||
      currentX >= size ||
      currentY < 0 ||
      currentY >= size
    ) {
      currentX = startingX;
      currentY = startingY;
    }
  }

  // temporary level layout for now, will focus on other mechanics first
  // 0 - starting room
  // 1 - small room template
  // 2 - medium room template
  // 3 - square room template
  // 4 - chest room
  // 5 - overseer boss room
  layout = [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 5, 3, -1, -1],
    [-1, -1, -1, 3, 2, 1, -1],
    [-1, -1, 1, 1, 2, -1, -1],
    [-1, -1, 2, 1, 3, -1, -1],
    [-1, -1, 1, 3, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1],
  ];

  return layout;
}
