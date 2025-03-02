export default function Minimap({ layout }) {
  return (
    <div className="absolute top-2 right-2 border-2 border-white">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((room, colIndex) => (
            <div
              key={colIndex}
              className={`w-8 h-8 flex items-center justify-center transparent opacity-80 ${
                room === 0
                  ? "bg-amber-500"
                  : room === 1
                  ? "bg-red-500"
                  : "bg-gray-900"
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
