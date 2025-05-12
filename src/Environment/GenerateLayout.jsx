// 0 - starting room
// 1 - small room template
// 2 - medium room template
// 3 - square room template
// 4 - chest room
// 5 - overseer boss room
// 6 - portal room

export function generateLayout(level) {
  let layout = Array.from({ length: 7 }, () => Array(7).fill(-1));
  const startingX = 3;
  const startingY = 3;
  const size = layout.length;

  layout[startingX][startingY] = 0;
  const placedRooms = [{ x: startingX, y: startingY }];

  // Total additional rooms to add (excluding the starting room)
  const maxRooms = 6;

  // Define movement directions.
  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  const directionKeys = Object.keys(directions);

  let chainCount = 0;
  const maxChain = 2;

  let iterations = 0;
  const maxIterations = 1000;

  while (placedRooms.length - 1 < maxRooms && iterations < maxIterations) {
    iterations++;

    let baseRoom;
    if (chainCount < maxChain) {
      baseRoom = placedRooms[Math.floor(Math.random() * placedRooms.length)];
    } else {
      baseRoom = { x: startingX, y: startingY };
      chainCount = 0;
    }

    const randomKey =
      directionKeys[Math.floor(Math.random() * directionKeys.length)];
    const [dx, dy] = directions[randomKey];
    const newX = baseRoom.x + dx;
    const newY = baseRoom.y + dy;

    if (
      newX >= 0 &&
      newX < size &&
      newY >= 0 &&
      newY < size &&
      layout[newX][newY] === -1
    ) {
      const roomType = Math.floor(Math.random() * 4) + 1;
      layout[newX][newY] = roomType;
      placedRooms.push({ x: newX, y: newY });
      chainCount++;
    }
  }

  let farthestRoom = null;
  let maxDistance = -1;
  for (const room of placedRooms) {
    if (layout[room.x][room.y] === 0) continue;
    const distance =
      Math.abs(room.x - startingX) + Math.abs(room.y - startingY);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestRoom = room;
    }
  }
  
  if (farthestRoom) {
    layout[farthestRoom.x][farthestRoom.y] = 4;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === startingX && j === startingY) continue;
      if (farthestRoom && i === farthestRoom.x && j === farthestRoom.y)
        continue;
      if (layout[i][j] === 4) {
        layout[i][j] = Math.floor(Math.random() * 3) + 1;
      }
    }
  }

  let portalCandidate = null;
  let secondMaxDistance = -1;
  for (const room of placedRooms) {
    if (layout[room.x][room.y] === 0) continue;
    if (farthestRoom && room.x === farthestRoom.x && room.y === farthestRoom.y)
      continue;
    const distance =
      Math.abs(room.x - startingX) + Math.abs(room.y - startingY);
    if (distance > secondMaxDistance) {
      secondMaxDistance = distance;
      portalCandidate = room;
    }
  }
  if (portalCandidate) {
    layout[portalCandidate.x][portalCandidate.y] = 6;
  }

  if (level === 3) {
    layout = [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, 5, -1, -1, -1],
      [-1, -1, -1, 0, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
    ];
  }

  // layout = [
  //   [-1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, 3, -1, -1, -1],
  //   [-1, -1, 6, 0, 4, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  // ];

  return layout;
}
