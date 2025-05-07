import React from "react";
import HallwayMesh from "./HallwayMesh";

// ------------------------------------------------------------------
// Room bounding‑box sizes (world units)
// ------------------------------------------------------------------
const ROOM_SIZES = {
  0: { w: 20, d: 20 }, // Starting
  1: { w: 25, d: 20 }, // Small
  2: { w: 30, d: 25 }, // Medium
  3: { w: 25, d: 25 }, // Square
  4: { w: 20, d: 20 }, // Chest
  5: { w: 27, d: 27 }, // Overseer
  6: { w: 20, d: 20 }, // Portal
};

export function Hallways({ layout, cellSize, playerRef }) {
  const hallways = [];
  const rows = layout.length;
  const cols = layout[0].length;
  const playerPos =
    playerRef?.current ? playerRef.current.translation() : null;

  const roomAt = (i, j) => (layout[i]?.[j] ?? -1) !== -1;

  // ---------- iterate over every room ---------------------------------
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const rv = layout[i][j];
      if (rv === -1) continue;                         // empty cell

      const { w: wA, d: dA } = ROOM_SIZES[rv];
      const cxA = (j - 3) * cellSize;                 // room‑A centre
      const czA = (i - 3) * cellSize;

      // ---------- 1. Horizontal corridor to the room on the right -----
      if (j + 1 < cols && roomAt(i, j + 1)) {
        const rvB = layout[i][j + 1];
        const { w: wB } = ROOM_SIZES[rvB];
        const cxB = cxA + cellSize;                   // room‑B centre (same z)

        const rightEdgeA   = cxA + wA / 2;
        const leftEdgeB    = cxB - wB / 2;
        const hallLen      = leftEdgeB - rightEdgeA;
        if (hallLen > 0.01) {                         // avoid negative / zero
          const hallCenter = (rightEdgeA + leftEdgeB) / 2;
          hallways.push(
            <HallwayMesh
              key={`hall-h-${i}-${j}`}
              position={[hallCenter, -0.01, czA]}
              geometryArgs={[hallLen, 1, 4]}          // X‑length hallway
              materialColor="white"
              playerPos={playerPos}
            />
          );
        }
      }

      // ---------- 2. Vertical corridor to the room below --------------
      if (i + 1 < rows && roomAt(i + 1, j)) {
        const rvB = layout[i + 1][j];
        const { d: dB } = ROOM_SIZES[rvB];
        const czB = czA + cellSize;                   // room‑B centre (same x)

        const bottomEdgeA  = czA + dA / 2;
        const topEdgeB     = czB - dB / 2;
        const hallLen      = topEdgeB - bottomEdgeA;
        if (hallLen > 0.01) {
          const hallCenter = (bottomEdgeA + topEdgeB) / 2;
          hallways.push(
            <HallwayMesh
              key={`hall-v-${i}-${j}`}
              position={[cxA, -0.01, hallCenter]}
              geometryArgs={[4, 1, hallLen]}          // Z‑length hallway
              materialColor="white"
              playerPos={playerPos}
            />
          );
        }
      }
    }
  }

  return <>{hallways}</>;
}
