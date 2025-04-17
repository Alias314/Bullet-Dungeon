// 0 - starting room
// 1 - small room template
// 2 - medium room template
// 3 - square room template
// 4 - chest room
// 5 - overseer boss room
// 6 - portal room

export function generateLayout(level) {
  // Create a 7x7 grid filled with -1.
  let layout = Array.from({ length: 7 }, () => Array(7).fill(-1));
  const startingX = 3;
  const startingY = 3;
  const size = layout.length;

  // Place the starting room (room type 0) at the center.
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

  // Use a chain counter to limit consecutive placements.
  let chainCount = 0;
  const maxChain = 2;

  // Limit iterations to avoid infinite loops.
  let iterations = 0;
  const maxIterations = 1000;

  while (placedRooms.length - 1 < maxRooms && iterations < maxIterations) {
    iterations++;

    // Choose the base room:
    // If chain count is under maxChain, pick a random room from those already placed.
    // Otherwise, use the starting room and reset the chain counter.
    let baseRoom;
    if (chainCount < maxChain) {
      baseRoom = placedRooms[Math.floor(Math.random() * placedRooms.length)];
    } else {
      baseRoom = { x: startingX, y: startingY };
      chainCount = 0;
    }

    // Pick a random direction.
    const randomKey =
      directionKeys[Math.floor(Math.random() * directionKeys.length)];
    const [dx, dy] = directions[randomKey];
    const newX = baseRoom.x + dx;
    const newY = baseRoom.y + dy;

    // Check if the new room is within bounds and unoccupied.
    if (
      newX >= 0 &&
      newX < size &&
      newY >= 0 &&
      newY < size &&
      layout[newX][newY] === -1
    ) {
      // Randomly select a room type between 1 and 4.
      // (We allow a chest room type (4) to appear here temporarily.)
      const roomType = Math.floor(Math.random() * 4) + 1;
      layout[newX][newY] = roomType;
      placedRooms.push({ x: newX, y: newY });
      chainCount++;
    }
    // If placement fails, the chainCount remains unchanged.
  }

  if (iterations >= maxIterations) {
    console.warn(
      "generateLayout reached maximum iterations; layout may be incomplete."
    );
  }

  // -----------------------------------------
  // Enforce EXACTLY ONE Chest Room (room type 4)
  // -----------------------------------------

  // Find the farthest room (by Manhattan distance) from the spawn among all placed rooms (excluding the starting room).
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
  // Force the farthest room to become the chest room.
  if (farthestRoom) {
    layout[farthestRoom.x][farthestRoom.y] = 4;
  }

  // Remove any other chest rooms.
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // Skip the starting room.
      if (i === startingX && j === startingY) continue;
      // Skip the designated chest room.
      if (farthestRoom && i === farthestRoom.x && j === farthestRoom.y)
        continue;
      if (layout[i][j] === 4) {
        // Replace with a random room type between 1 and 3.
        layout[i][j] = Math.floor(Math.random() * 3) + 1;
      }
    }
  }

  // -----------------------------
  // Add a Portal Room (room type 6)
  // -----------------------------
  // Choose the next farthest room that is not the starting room or the chest room.
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

  // For level 3, use a fixed layout.
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

  return layout;
}
