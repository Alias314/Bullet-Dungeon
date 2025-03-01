import Floor from "./Floor";
import Wall from "./Wall";
import Gate from "./Gate";
import { HallwayHorizontal, HallwayVertical } from "./Hallway";

export function EmptyRoom({ position, amountEnemy }) {
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
      <Floor roomDimensions={roomDimensions} position={position} />
      <HallwayVertical
        position={[
          position[0],
          position[1],
          hallwayPositionTop,
        ]}
      />
      <HallwayVertical
        position={[
          position[0],
          position[1],
          hallwayPositionBottom,
        ]}
      />
      <HallwayHorizontal 
        position={[
          hallwayPositionLeft,
          position[1],
          position[2],
        ]}
      />
      <HallwayHorizontal 
        position={[
          hallwayPositionRight,
          position[1],
          position[2],
        ]}
      />
      
      {walls}
      {amountEnemy && gates}
    </>
  );
}

export function StartingRoom({ position }) {
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
      <HallwayVertical
        position={[
          position[0],
          position[1],
          hallwayPositionTop,
        ]}
      />
      <HallwayVertical
        position={[
          position[0],
          position[1],
          hallwayPositionBottom,
        ]}
      />
      <HallwayHorizontal 
        position={[
          hallwayPositionLeft,
          position[1],
          position[2],
        ]}
      />
      <HallwayHorizontal 
        position={[
          hallwayPositionRight,
          position[1],
          position[2],
        ]}
      />

      <Floor roomDimensions={roomDimensions} position={position} />
      {walls}
    </>
  );
}
