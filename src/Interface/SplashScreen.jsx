import { useEffect } from "react";

export default function SplashScreen({ setHasClickedSplashScreen }) {
    useEffect(() => {
        const handleKeyPress = () => {
            setHasClickedSplashScreen(true);
            window.removeEventListener("keydown", handleKeyPress);
        }

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    })

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50 opacity-50">
      <h2 className="text-5xl font-bold mb-4">Defeat the Boss</h2>
      <p className="text-2xl animate-pulse">Press any key to continue</p>
    </div>
  );
}
