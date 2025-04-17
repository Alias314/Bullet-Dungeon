export default function GameOverOverlay({ handlePlayAgain }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative text-white flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-4 animate-bounce">
          Bruh you suck 💀
        </h2>
        <button
          className="p-4 w-64 text-3xl text-white bg-amber-700 rounded-3xl hover:bg-amber-600 transition duration-200"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
