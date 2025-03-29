import React from "react";
import Wall from "../Wall";
import WallSegment from "../WallSegment";
import Gate from "../Gate";

export default function WallsAndGates({
  position,
  roomDimensions,
  openings,
  amountEnemy,
  obstacleLayout = [] // default to an empty array if not provided
}) {
  const walls = [];
  const gates = [];
  const offset = 0.5;
  const [roomWidth, , roomDepth] = roomDimensions;

  // Use obstacleLayout's actual dimensions
  const numRows = obstacleLayout.length;
  const numCols = numRows > 0 && obstacleLayout[0] ? obstacleLayout[0].length : 0;

  // Loop over the obstacleLayout instead of roomDimensions if available
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (obstacleLayout[i][j] === 1) {
        walls.push(
          <Wall
            key={`obstacle-${j}-${i}`}
            position={[
              position[0] + j - roomWidth / 2 + offset,
              2,
              position[2] + i - roomDepth / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  // Top Wall (north)
  const topWallZ = position[2] - roomDepth / 2 + offset;
  if (openings.top) {
    const gapWidth = 4; // gap is 4 units wide
    const startIndex = Math.floor((roomWidth - gapWidth) / 2);
    const leftSegmentLength = startIndex;
    const rightSegmentLength = roomWidth - (startIndex + gapWidth);
    if (leftSegmentLength > 0) {
      const segmentCenterX =
        position[0] - roomWidth / 2 + leftSegmentLength / 2 + offset;
      walls.push(
        <WallSegment
          key="top-left"
          position={[segmentCenterX - offset, 2, topWallZ]}
          size={[leftSegmentLength, 3, 1]}
        />
      );
    }
    if (rightSegmentLength > 0) {
      const segmentCenterX =
        position[0] + roomWidth / 2 - rightSegmentLength / 2 - offset;
      walls.push(
        <WallSegment
          key="top-right"
          position={[segmentCenterX + offset, 2, topWallZ]}
          size={[rightSegmentLength, 3, 1]}
        />
      );
    }
  } else {
    walls.push(
      <WallSegment
        key="top"
        position={[position[0], 2, topWallZ]}
        size={[roomWidth, 3, 1]}
      />
    );
  }

  // Bottom Wall (south)
  const bottomWallZ = position[2] + roomDepth / 2 - offset;
  if (openings.bottom) {
    const gapWidth = 4;
    const startIndex = Math.floor((roomWidth - gapWidth) / 2);
    const leftSegmentLength = startIndex;
    const rightSegmentLength = roomWidth - (startIndex + gapWidth);
    if (leftSegmentLength > 0) {
      const segmentCenterX =
        position[0] - roomWidth / 2 + leftSegmentLength / 2 + offset;
      walls.push(
        <WallSegment
          key="bottom-left"
          position={[segmentCenterX - offset, 2, bottomWallZ]}
          size={[leftSegmentLength, 3, 1]}
        />
      );
    }
    if (rightSegmentLength > 0) {
      const segmentCenterX =
        position[0] + roomWidth / 2 - rightSegmentLength / 2 - offset;
      walls.push(
        <WallSegment
          key="bottom-right"
          position={[segmentCenterX + offset, 2, bottomWallZ]}
          size={[rightSegmentLength, 3, 1]}
        />
      );
    }
  } else {
    walls.push(
      <WallSegment
        key="bottom"
        position={[position[0], 2, bottomWallZ]}
        size={[roomWidth, 3, 1]}
      />
    );
  }

  // Left Wall (west)
  const leftWallX = position[0] - roomWidth / 2 + offset;
  if (openings.left) {
    const gapWidth = 4;
    const startIndex = Math.floor((roomDepth - gapWidth) / 2);
    const topSegmentLength = startIndex;
    const bottomSegmentLength = roomDepth - (startIndex + gapWidth);
    if (topSegmentLength > 0) {
      const segmentCenterZ =
        position[2] - roomDepth / 2 + topSegmentLength / 2 + offset;
      walls.push(
        <WallSegment
          key="left-top"
          position={[leftWallX, 2, segmentCenterZ - offset]}
          size={[1, 3, topSegmentLength]}
        />
      );
    }
    if (bottomSegmentLength > 0) {
      const segmentCenterZ =
        position[2] + roomDepth / 2 - bottomSegmentLength / 2 - offset;
      walls.push(
        <WallSegment
          key="left-bottom"
          position={[leftWallX, 2, segmentCenterZ + offset]}
          size={[1, 3, bottomSegmentLength]}
        />
      );
    }
  } else {
    walls.push(
      <WallSegment
        key="left"
        position={[leftWallX, 2, position[2]]}
        size={[1, 3, roomDepth]}
      />
    );
  }

  // Right Wall (east)
  const rightWallX = position[0] + roomWidth / 2 - offset;
  if (openings.right) {
    const gapWidth = 4;
    const startIndex = Math.floor((roomDepth - gapWidth) / 2);
    const topSegmentLength = startIndex;
    const bottomSegmentLength = roomDepth - (startIndex + gapWidth);
    if (topSegmentLength > 0) {
      const segmentCenterZ =
        position[2] - roomDepth / 2 + topSegmentLength / 2 + offset;
      walls.push(
        <WallSegment
          key="right-top"
          position={[rightWallX, 2, segmentCenterZ - offset]}
          size={[1, 3, topSegmentLength]}
        />
      );
    }
    if (bottomSegmentLength > 0) {
      const segmentCenterZ =
        position[2] + roomDepth / 2 - bottomSegmentLength / 2 - offset;
      walls.push(
        <WallSegment
          key="right-bottom"
          position={[rightWallX, 2, segmentCenterZ + offset]}
          size={[1, 3, bottomSegmentLength]}
        />
      );
    }
  } else {
    walls.push(
      <WallSegment
        key="right"
        position={[rightWallX, 2, position[2]]}
        size={[1, 3, roomDepth]}
      />
    );
  }

  // Gate Setup (only if there are enemies)
  if (amountEnemy) {
    // Top Gate
    if (openings.top) {
      const start = Math.floor((roomWidth - 4) / 2);
      for (let j = start; j < start + 4; j++) {
        gates.push(
          <Gate
            key={`top-${j}`}
            position={[
              position[0] + j - roomWidth / 2 + offset,
              1.3,
              position[2] - roomDepth / 2 + offset,
            ]}
          />
        );
      }
    }
    // Bottom Gate
    if (openings.bottom) {
      const start = Math.floor((roomWidth - 4) / 2);
      for (let j = start; j < start + 4; j++) {
        gates.push(
          <Gate
            key={`bottom-${j}`}
            position={[
              position[0] + j - roomWidth / 2 + offset,
              1.3,
              position[2] + roomDepth / 2 - offset,
            ]}
          />
        );
      }
    }
    // Left Gate
    if (openings.left) {
      const start = Math.floor((roomDepth - 4) / 2);
      for (let i = start; i < start + 4; i++) {
        gates.push(
          <Gate
            key={`left-${i}`}
            position={[
              position[0] - roomWidth / 2 + offset,
              1.3,
              position[2] + i - roomDepth / 2 + offset,
            ]}
          />
        );
      }
    }
    // Right Gate
    if (openings.right) {
      const start = Math.floor((roomDepth - 4) / 2);
      for (let i = start; i < start + 4; i++) {
        gates.push(
          <Gate
            key={`right-${i}`}
            position={[
              position[0] + roomWidth / 2 - offset,
              1.3,
              position[2] + i - roomDepth / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  return (
    <>
      {walls}
      {amountEnemy && gates}
    </>
  );
}
