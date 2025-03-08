import Floor from "../Floor";
import Wall from "../Wall";
import Gate from "../Gate";
import { HallwayHorizontal, HallwayVertical } from "../Hallway";
import { useRef, useEffect } from "react";
import TreasureChest from "../Obstacles/TreasureChest";
import { BoxDestructible, BoxNonDestructible } from "../Obstacles/Boxes";

// medium room with boxes
export default function MediumRoom2({
  position,
  playerRef,
  openings = { top: true, bottom: true, left: true, right: true },
}) {
  const roomDimensions = [30, 1, 25];
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
  const walls = [];

  // Custom layout
  // 0 is nothing,
  // 1 is wall,
  // 2 is box (non-destructable),
  // 3 is box (destructable),
  // 4 is treasure chest,
  // 5 is spike trap or something.
  const layout = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // const layout = Array.from({ length: roomDimensions[0] }, () =>
  //   Array(roomDimensions[2]).fill(0)
  // );

  // surround the exterior with walls based on room dimensions
  // i mean you could do this in the layout but this easier
  for (let i = 0; i < roomDimensions[2]; i++) {
    for (let j = 0; j < roomDimensions[0]; j++) {
      if (
        i === 0 ||
        i === roomDimensions[2] - 1 ||
        j === 0 ||
        j === roomDimensions[0] - 1
      ) {
        layout[i][j] = 1;
      }
    }
  }

  // this is openings for hallway. depends on openings props
  // for now i just set true to all
  if (openings.top) {
    const start = Math.floor((roomDimensions[0] - 4) / 2);
    for (let j = start; j < start + 4; j++) {
      layout[0][j] = 0;
    }
  }
  if (openings.bottom) {
    const start = Math.floor((roomDimensions[0] - 4) / 2);
    for (let j = start; j < start + 4; j++) {
      layout[roomDimensions[2] - 1][j] = 0;
    }
  }
  if (openings.left) {
    const start = Math.floor((roomDimensions[2] - 4) / 2);
    for (let i = start; i < start + 4; i++) {
      layout[i][0] = 0;
    }
  }
  if (openings.right) {
    const start = Math.floor((roomDimensions[2] - 4) / 2);
    for (let i = start; i < start + 4; i++) {
      layout[i][roomDimensions[0] - 1] = 0;
    }
  }

  // this for adding stuff based on layout
  // just set an if statement for other obstacles
  for (let i = 0; i < roomDimensions[2]; i++) {
    for (let j = 0; j < roomDimensions[0]; j++) {
      if (layout[i][j] === 1) {
        walls.push(
          <Wall
            key={`${j}-${i}`}
            position={[
              position[0] + j - roomDimensions[0] / 2 + offset,
              2,
              position[2] + i - roomDimensions[2] / 2 + offset,
            ]}
          />
        );
      } else if (layout[i][j] === 3) {
        walls.push(
          <BoxDestructible
            key={`${j}-${i}`}
            position={[
              position[0] + j - roomDimensions[0] / 2 + offset,
              1,
              position[2] + i - roomDimensions[2] / 2 + offset,
            ]}
          />
        )
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
