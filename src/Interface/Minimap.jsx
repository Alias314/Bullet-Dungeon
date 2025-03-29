export default function Minimap({ layout, playerRef }) {
  const cellSize = 37;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const distanceToView = 24;

  let highlightedRow = -1;
  let highlightedCol = -1;

  if (playerPos) {
    // Instead of destructuring as an array, access the object properties.
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
                {/* The room cell */}
                <div
                  className={`w-8 h-8 mr-2 mb-2 flex items-center justify-center ${bgColor} ${isHighlighted ? "border-4 border-green-500" : ""}`}
                ></div>
                {/* Horizontal hallway indicator: if the right neighbor exists */}
                {j < row.length - 1 && room !== -1 && row[j + 1] !== -1 && (
                  <div className="absolute left-8 top-4 w-2 h-1 bg-white"></div>
                )}
                {i < row.length - 1 &&
                  room !== -1 &&
                  layout[i + 1][j] !== -1 && (
                    <div className="absolute left-3.5 top-8 w-1 h-2 bg-white"></div>
                  )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
