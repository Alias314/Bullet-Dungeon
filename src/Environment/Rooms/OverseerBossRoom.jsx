import Floor from "../Floor";
import Wall from "../Wall";
import Gate from "../Gate";
import { HallwayHorizontal, HallwayVertical } from "../Hallway";
import { useRef, useEffect } from "react";

// just use this as template
export default function OverseerBossRoom({ position, playerRef, setBosses }) {
  const roomSize = 50;
  const roomDimensions = [45, 1, 30];
  const offset = 0.5;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;
  const distanceToView = 24;
  const layout = Array.from({ length: roomSize }, () =>
    Array(roomSize).fill(0)
  );
  const walls = [];
  const hasSummonedRef = useRef(false);

  if (!hasSummonedRef.current) {
    setBosses({ id: 1, type: "Overseer", health: 1000 });
    hasSummonedRef.current = true;
  }

  // this for custom layout.
  // 0 is nothing
  // 1 is wall
  // 2 is box (non-destructable)
  // 3 is box (destructable)
  // 4 is idk maybe like spike traps or something
  for (let i = 0; i < roomDimensions[0]; i++) {
    for (let j = 0; j < roomDimensions[2]; j++) {
      if (
        i === 0 ||
        i === roomDimensions[0] - 1 ||
        j === 0 ||
        j === roomDimensions[2] - 1
      ) {
        layout[i][j] = 1;
      }
    }
  }

  for (let i = 0; i < roomSize; i++) {
    for (let j = 0; j < roomSize; j++) {
      if (layout[i][j] === 1) {
        walls.push(
          <Wall
            key={`${i}${j}`}
            position={[
              position[0] + i - roomDimensions[0] / 2 + offset,
              2,
              position[2] + j - roomDimensions[2] / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  return (
    <>
      <Floor roomDimensions={roomDimensions} position={position} />
      {walls}
    </>
  );
}
