import React, { useState } from "react";
import Floor from "../Floor";
import WallsAndGates from "../Logic/CreateWallsAndGates";
import TreasureChest from "../Obstacles/TreasureChest";

export default function ChestRoom({
  position,
  playerRef,
  openings,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
  setShowRoomClear,
  currentWeapon,
  setCurrentWeapon,
  isShoot
}) {
  const roomDimensions = [20, 1, 20];
  const [roomWidth, , roomDepth] = roomDimensions;
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
  // const weapons = ["shotgun", "machineGun"];
  const weapons = ["machineGun"];

  const [treasureState, setTreasureState] = useState({
    isGunDropped: false,
    chestGun: weapons[Math.floor(Math.random() * weapons.length)],
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
              position={[position[0], position[1], position[2]]}
            />
            <WallsAndGates
              position={[position[0], position[1], position[2]]}
              roomDimensions={roomDimensions}
              openings={openings}
              amountEnemy={amountEnemy}
            />
            <TreasureChest
              position={[position[0], 1, position[2]]}
              absoluteDistance={absoluteDistance}
              playerPos={playerPos}
              currentWeapon={currentWeapon}
              setCurrentWeapon={setCurrentWeapon}
              treasureState={treasureState}
              setTreasureState={setTreasureState}
              isShoot={isShoot}
            />
          </>
        )}
    </>
  );
}
