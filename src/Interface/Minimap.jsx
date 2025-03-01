function generateLayout(layout, size, startingX, startingY) {
  const maxRooms = 5;
  let amountRooms = 1;

  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };

  const keys = Object.keys(directions);
  let currentX = startingX;
  let currentY = startingY;

  while (amountRooms <= maxRooms) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomDirection = directions[randomKey];
    currentX += randomDirection[0];
    currentY += randomDirection[1];

    if (
      currentX >= 0 &&
      currentX < size &&
      currentY >= 0 &&
      currentY < size &&
      layout[currentX][currentY] === -1
    ) {
      layout[currentX][currentY] = 1;
      amountRooms++;
    } else if (
      currentX < 0 ||
      currentX >= size ||
      currentY < 0 ||
      currentY >= size
    ) {
      currentX = startingX;
      currentY = startingY;
    }
  }

  return layout;
}

export default function Minimap({ layout }) {
  return (
    <div className="absolute top-2 right-2">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((room, colIndex) => (
            <div
              key={colIndex}
              className={`w-8 h-8 border-2 border-black flex items-center justify-center ${
                room === 0
                  ? "bg-amber-500"
                  : room === 1
                  ? "bg-red-500"
                  : "bg-white"
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
