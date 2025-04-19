import React, { useRef, useEffect, useState } from "react";
import Floor from "../Floor";
import WallsAndGates from "../Logic/CreateWallsAndGates";
import useRoomWaveSpawner from "../Logic/useRoomWaveSpawner";

// small room is 25x25
export default function SquareRoomTemplate({
  position,
  playerRef,
  openings,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
  setShowRoomClear,
}) {
  const roomDimensions = [25, 1, 25];
  const [roomWidth, , roomDepth] = roomDimensions;
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
  const maxWavesRef = useRef(Math.floor(Math.random() * 3) + 1);

  useRoomWaveSpawner({
    playerPos,
    position,
    roomDimensions,
    roomWidth,
    roomDepth,
    amountEnemy,
    setEnemies,
    setAmountEnemy,
    setShowRoomClear,
    maxWavesRef,
  });

  return (
    <>
      {playerPos &&
        absoluteDistance &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <>
            <Floor roomDimensions={roomDimensions} position={[position[0] + 0.5, position[1], position[2] + 0.5]} />
            <WallsAndGates
              position={[position[0] + 0.5, position[1], position[2] + 0.5]}
              roomDimensions={roomDimensions}
              openings={openings}
              amountEnemy={amountEnemy}
            />
          </>
        )}
    </>
  );
}
