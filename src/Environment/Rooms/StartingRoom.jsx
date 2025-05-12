import React, { useRef, useEffect } from "react";
import Floor from "../Floor";
import WallsAndGates from "../Logic/CreateWallsAndGates"; // adjust the path as needed
import SpikeTrap from "../Obstacles/SpikeTrap";
import CreateObstacles from "../Logic/CreateObstacles";

const getRandomPos = (sizeX, sizeZ) => {
  const x = Math.floor(Math.random() * sizeX);
  const z = Math.floor(Math.random() * sizeZ);

  return [x, z];
};

// small room is 25x25
export default function StartingRoom({
  position,
  playerRef,
  openings,
  amountEnemy,
}) {
  const roomDimensions = [20, 1, 20];
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
            />
            {/* <CreateObstacles position={position} roomDimensions={roomDimensions} /> */}
          </>
        )}
    </>
  );
}
