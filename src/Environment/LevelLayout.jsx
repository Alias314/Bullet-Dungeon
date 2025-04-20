import React from "react";
import StartingRoom from "./Rooms/StartingRoom";
import ChestRoom from "./Rooms/ChestRoom";
import SmallRoomTemplate from "./Rooms/SmallRoomTemplate";
import SquareRoomTemplate from "./Rooms/SquareRoomTemplate";
import MediumRoomTemplate from "./Rooms/MediumRoomTemplate";
import OverseerBossRoom from "./Rooms/OverseerBossRoom";
import PortalRoom from "./Rooms/PortalRoom";
import { Hallways } from "./Hallway"; // adjust path as needed
import RoomModel from "./Rooms/RoomModel";

export default function LevelLayout({
  layout,
  amountEnemy,
  setAmountEnemy,
  playerRef,
  setEnemies,
  setBosses,
  setShowRoomClear,
  setLayout,
  level,
  setHasBeatLevel,
  gameResetKey,
  currentWeapon,
  setCurrentWeapon,
  isShoot
}) {
  const cellSize = 37;

  // Compute dynamic openings based on adjacent rooms
  const getOpenings = (i, j) => {
    const openings = { top: false, bottom: false, left: false, right: false };
    // Check above
    if (i > 0 && layout[i - 1][j] !== -1) {
      openings.top = true;
    }
    // Check below
    if (i < layout.length - 1 && layout[i + 1][j] !== -1) {
      openings.bottom = true;
    }
    // Check left
    if (j > 0 && layout[i][j - 1] !== -1) {
      openings.left = true;
    }
    // Check right
    if (j < layout[i].length - 1 && layout[i][j + 1] !== -1) {
      openings.right = true;
    }
    return openings;
  };

  return (
    <>
      {layout.map((row, i) =>
        row.map((room, j) => {
          // Skip if no room
          if (room === -1) return null;

          const position = [(j - 3) * cellSize, 0, (i - 3) * cellSize];
          // Dynamically compute openings for this room
          const openings = getOpenings(i, j);

          switch (room) {
            case 0:
              return (
                <StartingRoom
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                />
                // <RoomModel
                //   key={`room-${i}-${j}`}
                //   position={position}
                //   playerRef={playerRef}
                //   openings={openings}
                //   amountEnemy={amountEnemy}
                //   setAmountEnemy={setAmountEnemy}
                //   setEnemies={setEnemies}
                //   setShowRoomClear={setShowRoomClear}
                // />
              );
            case 1:
              return (
                <SmallRoomTemplate
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                  setAmountEnemy={setAmountEnemy}
                  setEnemies={setEnemies}
                  setShowRoomClear={setShowRoomClear}
                />
              );
            case 2:
              return (
                <MediumRoomTemplate
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                  setAmountEnemy={setAmountEnemy}
                  setEnemies={setEnemies}
                  setShowRoomClear={setShowRoomClear}
                />
              );
            case 3:
              return (
                <SquareRoomTemplate
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                  setAmountEnemy={setAmountEnemy}
                  setEnemies={setEnemies}
                  setShowRoomClear={setShowRoomClear}
                />
              );
            case 4:
              return (
                <ChestRoom
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                  setAmountEnemy={setAmountEnemy}
                  setEnemies={setEnemies}
                  setShowRoomClear={setShowRoomClear}
                  currentWeapon={currentWeapon}
                  setCurrentWeapon={setCurrentWeapon}
                  isShoot={isShoot}
                />
              );
            case 5:
              return (
                <OverseerBossRoom
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  setBosses={setBosses}
                  amountEnemy={amountEnemy}
                />
              );
            case 6:
              return (
                <PortalRoom
                  key={`room-${i}-${j}-${gameResetKey.current}`}
                  position={position}
                  playerRef={playerRef}
                  openings={openings}
                  amountEnemy={amountEnemy}
                  setLayout={setLayout}
                  level={level}
                  setHasBeatLevel={setHasBeatLevel}
                />
              );
            default:
              return null;
          }
        })
      )}
      <Hallways layout={layout} cellSize={cellSize} playerRef={playerRef} />
    </>
  );
}
