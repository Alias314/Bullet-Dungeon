import React, { useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import Floor from "../Floor";
import Gate from "../Gate";
import { summonEnemies, delay } from "../../Utils/helper";
import WallsAndGates from "../Logic/CreateWallsAndGates"; // adjust the path as needed
import useRoomWaveSpawner from "../Logic/useRoomWaveSpawner"; // adjust path as needed


// small room is 25x25
export default function SquareRoomTemplate({
  position,
  playerRef,
  openings,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
}) {
  const roomDimensions = [25, 1, 25];
  const [roomWidth, , roomDepth] = roomDimensions;
  const offset = 0.5;
  const playerPos =
    playerRef && playerRef.current
      ? playerRef.current.translation()
      : null;
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;
  const distanceToView = 24;

  // Define your obstacle layout (this can be further refactored if desired)
  const obstacleLayout = Array(25)
    .fill(0)
    .map(() => Array(25).fill(0));

  useRoomWaveSpawner({
      playerPos,
      position,
      roomDimensions,
      roomWidth,
      roomDepth,
      amountEnemy,
      setEnemies,
      setAmountEnemy,
    });

  return (
    <>
      {playerPos &&
        absoluteDistance &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <>
            <Floor roomDimensions={roomDimensions} position={position} />
            <WallsAndGates
              position={position}
              roomDimensions={roomDimensions}
              openings={openings}
              amountEnemy={amountEnemy}
              obstacleLayout={obstacleLayout}
            />
          </>
        )}
    </>
  );
}
