import { useEffect } from "react";

export default function VictoryOverlay() {
  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50 opacity-50">
      <h2 className="text-5xl font-bold mb-4 animate-bounce">Damn your so pro 😎</h2>
      <p className="text-2xl animate-bounce">Play again button? nah just refresh</p>
    </div>
  );
}
