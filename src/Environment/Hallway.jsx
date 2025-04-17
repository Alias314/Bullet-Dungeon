import React from "react";
import HallwayMesh from "./HallwayMesh"; // adjust path as needed
import { depth } from "three/tsl";

// Returns the room dimensions (width and depth) for each room type
function getRoomDimensions(roomValue) {
  switch (roomValue) {
    case 0: // StartingRoom
      return { width: 18, depth: 18 };
    case 1: // SmallRoomTemplate
      return { width: 25, depth: 20 };
    case 2: // MediumRoomTemplate
      return { width: 30, depth: 25 };
    case 3: // SquareRoomTemplate
      return { width: 25, depth: 25 };
    case 4:
      return {width: 20, depth: 20};
    case 5:
      return {width: 27, depth: 27};
    case 6:
      return {width: 18, depth: 18};
    default:
      return { width: 25, depth: 20 };
  }
}

// This component calculates and renders hallways between adjacent rooms
export function Hallways({ layout, cellSize, playerRef }) {
  const hallways = [];
  const rows = layout.length;
  const cols = layout[0].length;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;

  // Compute dynamic openings based on adjacent rooms
  const getOpenings = (i, j) => {
    const openings = { top: false, bottom: false, left: false, right: false };
    if (i > 0 && layout[i - 1][j] !== -1) {
      openings.top = true;
    }
    if (i < rows - 1 && layout[i + 1][j] !== -1) {
      openings.bottom = true;
    }
    if (j > 0 && layout[i][j - 1] !== -1) {
      openings.left = true;
    }
    if (j < cols - 1 && layout[i][j + 1] !== -1) {
      openings.right = true;
    }
    return openings;
  };

  // Iterate over each cell to check for a right or bottom neighbor
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const roomValue = layout[i][j];
      if (roomValue === -1) continue; // Skip if no room

      // Compute the center position of this room
      const centerX = (j - 3) * cellSize;
      const centerZ = (i - 3) * cellSize;
      const roomDims = getRoomDimensions(roomValue);

      // --- Horizontal Hallway: Check right neighbor ---
      if (j < cols - 1 && layout[i][j + 1] !== -1) {
        const currentOpenings = getOpenings(i, j);
        const neighborOpenings = getOpenings(i, j + 1);

        // Only add a hallway if both rooms have openings facing each other
        if (currentOpenings.right && neighborOpenings.left) {
          const neighborValue = layout[i][j + 1];
          const neighborDims = getRoomDimensions(neighborValue);
          const hallwayLength =
            cellSize - (roomDims.width / 2 + neighborDims.width / 2);
          if (hallwayLength > 0) {
            const hallCenterX = centerX + cellSize / 2;
            const hallCenterZ = centerZ;
            hallways.push(
              <HallwayMesh
                key={`hallway-h-${i}-${j}`}
                position={[hallCenterX, -0.01, hallCenterZ]}
                geometryArgs={[hallwayLength + 10, 1, 4]}
                materialColor="white"
                playerPos={playerPos}
              />
            );
          }
        }
      }

      // --- Vertical Hallway: Check bottom neighbor ---
      if (i < rows - 1 && layout[i + 1][j] !== -1) {
        const currentOpenings = getOpenings(i, j);
        const neighborOpenings = getOpenings(i + 1, j);

        // Only add a hallway if both rooms have openings facing each other
        if (currentOpenings.bottom && neighborOpenings.top) {
          const neighborValue = layout[i + 1][j];
          const neighborDims = getRoomDimensions(neighborValue);
          const hallwayLength =
            cellSize - (roomDims.depth / 2 + neighborDims.depth / 2);
          if (hallwayLength > 0) {
            const hallCenterX = centerX;
            const hallCenterZ = centerZ + cellSize / 2;
            hallways.push(
              <HallwayMesh
                key={`hallway-v-${i}-${j}`}
                position={[hallCenterX, -0.01, hallCenterZ]}
                geometryArgs={[4, 1, hallwayLength + 10]}
                materialColor="white"
                playerPos={playerPos}
              />
            );
          }
        }
      }
    }
  }

  return <>{hallways}</>;
}
