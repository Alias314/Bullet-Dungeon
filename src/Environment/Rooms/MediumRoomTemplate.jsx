import React, { useRef, useEffect } from "react";
import Floor from "../Floor";
import WallsAndGates from "../Logic/CreateWallsAndGates"; // adjust the path as needed
import useRoomWaveSpawner from "../Logic/useRoomWaveSpawner"; // adjust path as needed
import CreateObstacles from "../Logic/CreateObstacles";

export default function MediumRoomTemplate({
  position,
  playerRef,
  openings,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
  setShowRoomClear,
}) {
  const roomDimensions = [30, 1, 25];
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
  const maxWavesRef = useRef(1);

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
            <Floor
              roomDimensions={roomDimensions}
              position={[position[0], position[1], position[2] + 0.5]}
            />
            <WallsAndGates
              position={[position[0], position[1], position[2] + 0.5]}
              roomDimensions={roomDimensions}
              openings={openings}
              amountEnemy={amountEnemy}
            />
            <CreateObstacles
              position={position}
              roomDimensions={roomDimensions}
            />
          </>
        )}
    </>
  );
}
