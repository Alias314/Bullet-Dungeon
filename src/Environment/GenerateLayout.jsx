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

  // Place the starting room at the center (room type 0).
  layout[startingX][startingY] = 0;

  // Array holding coordinates of placed rooms (ensuring connectivity).
  const placedRooms = [{ x: startingX, y: startingY }];

  // Total additional rooms to add (excluding the starting room).
  const maxRooms = 6;

  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  const directionKeys = Object.keys(directions);

  let iterations = 0;
  const maxIterations = 1000;

  // Continue until the desired number of rooms have been placed (not counting the starting room)
  while (placedRooms.length - 1 < maxRooms && iterations < maxIterations) {
    iterations++;
    // Pick a random room from the already placed rooms (the cluster).
    const randomIndex = Math.floor(Math.random() * placedRooms.length);
    const currentRoom = placedRooms[randomIndex];

    // Pick a random direction from that room.
    const randomKey =
      directionKeys[Math.floor(Math.random() * directionKeys.length)];
    const [dx, dy] = directions[randomKey];
    const newX = currentRoom.x + dx;
    const newY = currentRoom.y + dy;

    // Ensure the new room is within bounds and not already occupied.
    if (
      newX >= 0 &&
      newX < size &&
      newY >= 0 &&
      newY < size &&
      layout[newX][newY] === -1
    ) {
      // Randomly select one of the room templates (excluding chest rooms, here using types 1-3).
      // (If you need chest rooms, you can adjust this logic as needed.)
      const roomType = Math.floor(Math.random() * 3) + 1;

      layout[newX][newY] = roomType;
      placedRooms.push({ x: newX, y: newY });
    }
  }

  if (iterations >= maxIterations) {
    console.warn(
      "generateLayout reached maximum iterations; layout may be incomplete."
    );
  }

  // Find the farthest room (using Manhattan distance) excluding the starting room,
  // then mark that room as the portal (room type 6).
  let farthestRoom = null;
  let maxDistance = -1;
  for (const room of placedRooms) {
    // Skip the starting room.
    if (layout[room.x][room.y] === 0) continue;

    const distance =
      Math.abs(room.x - startingX) + Math.abs(room.y - startingY);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestRoom = room;
    }
  }
  if (farthestRoom) {
    layout[farthestRoom.x][farthestRoom.y] = 6;
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
  //   [-1, -1, -1, 5, -1, -1, -1],
  //   [-1, -1, 6, 0, 3, -1, -1],
  //   [-1, -1, -1, 2, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1],
  // ];

  return layout;
}
