import { EmptyRoom, StartingRoom } from "./RoomLayout";

export default function LevelLayout({ layout, playerRef }) {
  const cellSize = 34;

  return (
    <>
      {layout.map((row, i) =>
        row.map((room, j) =>
          room === 0 ? (
            // <StartingRoom
            //   position={[(j - 3) * cellSize, 0, (i - 3) * cellSize]}
            //   playerRef={playerRef}
            // />
            <EmptyRoom
              position={[(j - 3) * cellSize, 0, (i - 3) * cellSize]}
              amountEnemy={0}
              playerRef={playerRef}
            />
          ) : room === 1 ? (
            <EmptyRoom
              position={[(j - 3) * cellSize, 0, (i - 3) * cellSize]}
              amountEnemy={0}
              playerRef={playerRef}
            />
          ) : null
        )
      )}
    </>
  );
}
