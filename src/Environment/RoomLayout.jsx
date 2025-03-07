import Floor from "./Floor";
import Wall from "./Wall";
import Gate from "./Gate";
import { HallwayHorizontal, HallwayVertical } from "./Hallway";
import { useRef, useEffect } from "react";

const getRandomPosition = (roomSize, position) => {
  roomSize -= 2;
  const x = Math.random() * roomSize - roomSize / 2 + position[0];
  const y = 1;
  const z = Math.random() * roomSize - roomSize / 2 + position[2];

  return [x, y, z];
};

const summonEnemies = (roomSize, position, setAmountEnemy) => {
  const enemyList = [];
  const amountEnemy = 10;

  for (let i = 0; i < amountEnemy; i++) {
    const randomValue = Math.random();
    let type;
    if (randomValue < 0.5) {
      type = "melee";
    } else if (randomValue < 0.8) {
      type = "pistol";
    } else {
      type = "gatling";
    }
    enemyList.push({
      id: i,
      type,
      health: 30,
      position: getRandomPosition(roomSize, position),
    });
  }

  setAmountEnemy(amountEnemy);

  return enemyList;
};

export function EmptyRoom({
  position,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
  playerRef,
}) {
  const roomSize = 22;
  const hallwaySize = 6;
  const roomDimensions = [roomSize, 1, roomSize];
  const walls = [];
  const gates = [];
  const gateRange = [roomSize / 2 - 2, roomSize / 2 + 1];
  const hallwayPositionTop = position[2] - roomSize / 2 - hallwaySize / 2;
  const hallwayPositionBottom = position[2] + roomSize / 2 + hallwaySize / 2;
  const hallwayPositionLeft = position[0] - roomSize / 2 - hallwaySize / 2;
  const hallwayPositionRight = position[0] + roomSize / 2 + hallwaySize / 2;
  const offset = 0.5;
  const distanceToView = 24;
  const distanceToSummon = roomSize / 2 - 1;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const hasSummonedRef = useRef(false);
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;

  useEffect(() => {
    if (
      !hasSummonedRef.current &&
      playerPos &&
      absoluteDistance[0] <= distanceToSummon &&
      absoluteDistance[2] <= distanceToSummon
    ) {
      setEnemies(() => summonEnemies(roomSize, position, setAmountEnemy));
      hasSummonedRef.current = true;
    }
  }, [playerPos, absoluteDistance, distanceToView, setEnemies]);

  for (let i = 0; i < roomSize; i++) {
    for (let j = 0; j < roomSize; j++) {
      if (
        (i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
        ((i >= gateRange[0] && i <= gateRange[1]) ||
          (j >= gateRange[0] && j <= gateRange[1]))
      ) {
        gates.push(
          <Gate
            key={`${i}-${j}`}
            position={[
              position[0] + i - roomSize / 2 + offset,
              1.3,
              position[2] + j - roomSize / 2 + offset,
            ]}
          />
        );
      }

      if (
        (i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
        !(
          (i >= gateRange[0] && i <= gateRange[1]) ||
          (j >= gateRange[0] && j <= gateRange[1])
        )
      ) {
        walls.push(
          <Wall
            key={`${i}-${j}`}
            position={[
              position[0] + i - roomSize / 2 + offset,
              2,
              position[2] + j - roomSize / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  return (
    <>
      {playerPos &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <>
            <Floor roomDimensions={roomDimensions} position={position} />
            <HallwayVertical
              position={[position[0], position[1], hallwayPositionTop]}
            />
            <HallwayVertical
              position={[position[0], position[1], hallwayPositionBottom]}
            />
            <HallwayHorizontal
              position={[hallwayPositionLeft, position[1], position[2]]}
            />
            <HallwayHorizontal
              position={[hallwayPositionRight, position[1], position[2]]}
            />
            {walls}
            {amountEnemy && gates}
          </>
        )}
    </>
  );
}

export function StartingRoom({ position, playerRef }) {
  const roomSize = 12;
  const hallwaySize = 6;
  const roomDimensions = [roomSize, 1, roomSize];
  const walls = [];
  const gateRange = [roomSize / 2 - 2, roomSize / 2 + 1];
  const hallwayPositionTop = position[2] - roomSize / 2 - hallwaySize / 2;
  const hallwayPositionBottom = position[2] + roomSize / 2 + hallwaySize / 2;
  const hallwayPositionLeft = position[0] - roomSize / 2 - hallwaySize / 2;
  const hallwayPositionRight = position[0] + roomSize / 2 + hallwaySize / 2;
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

  for (let i = 0; i < roomSize; i++) {
    for (let j = 0; j < roomSize; j++) {
      if (
        (i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
        !(
          (i >= gateRange[0] && i <= gateRange[1]) ||
          (j >= gateRange[0] && j <= gateRange[1])
        )
      ) {
        walls.push(
          <Wall
            key={`${i}-${j}`}
            position={[
              position[0] + i - roomSize / 2 + offset,
              2,
              position[2] + j - roomSize / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  return (
    <>
      {playerPos &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <>
            <HallwayVertical
              position={[position[0], position[1], hallwayPositionTop]}
            />
            <HallwayVertical
              position={[position[0], position[1], hallwayPositionBottom]}
            />
            <HallwayHorizontal
              position={[hallwayPositionLeft, position[1], position[2]]}
            />
            <HallwayHorizontal
              position={[hallwayPositionRight, position[1], position[2]]}
            />

            <Floor roomDimensions={roomDimensions} position={position} />
            {walls}
          </>
        )}
    </>
  );
}

// just use this as template
export function CustomRoom({ position, playerRef }) {
  const roomSize = 50;
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
  const layout = Array.from({ length: 50 }, () => Array(50).fill(0));
  const walls = [];

  // this for custom layout. 
  // 0 is nothing 
  // 1 is wall 
  // 2 is box (non-destructable)
  // 3 is box (destructable)
  // 4 is idk maybe like spike traps or something
  for (let i = 0; i < roomSize; i++) {
    for (let j = 0; j < roomSize; j++) {
      if (i == j) {
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
              position[0] + i - roomSize / 2 + offset,
              2,
              position[2] + j - roomSize / 2 + offset,
            ]}
          />
        );
      }
    }
  }

  return (
    <>
      {walls}
    </>
  );
}
