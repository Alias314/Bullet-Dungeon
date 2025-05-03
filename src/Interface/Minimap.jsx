export default function Minimap({ layout, playerRef }) {
  const cellSize = 37;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const distanceToView = 24;

  let highlightedRow = -1;
  let highlightedCol = -1;

  if (playerPos) {
    const x = playerPos.x;
    const z = playerPos.z;
    highlightedCol = Math.round(x / cellSize + 3);
    highlightedRow = Math.round(z / cellSize + 3);
  }

  return (
    <div className="absolute top-2 right-2 border-2 border-white p-1 bg-gray-900 opacity-80">
      {layout.map((row, i) => (
        <div key={i} className="flex">
          {row.map((room, j) => {
            const bgColor =
              room === 0
                ? "bg-red-500"
                : room !== -1
                ? "bg-red-500"
                : "bg-gray-900";
            const isHighlighted = i === highlightedRow && j === highlightedCol;

            return (
              <div key={j} className="relative">
                <div
                  className={`w-10 h-10 mr-2 mb-2 flex items-center justify-center ${bgColor} ${
                    isHighlighted ? "border-4 border-green-500" : ""
                  }`}
                ></div>
                {j < row.length - 1 && room !== -1 && row[j + 1] !== -1 && (
                  <div className="absolute left-10 top-4 w-2 h-1 bg-white"></div>
                )}
                {i < row.length - 1 &&
                  room !== -1 &&
                  layout[i + 1][j] !== -1 && (
                    <div className="absolute left-3.5 top-10 w-1 h-2 bg-white"></div>
                  )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
