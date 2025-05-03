import { useEffect, useState } from "react";
import { usePlayerStore } from "./Logic/usePlayerStore";

export default function Timer() {
  const [time, setTime] = useState(0);
  const damage = usePlayerStore((state) => state.stats.xp);
  const increaseStat = usePlayerStore((state) => state.increaseStat);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
      increaseStat('xp', 12);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-35 top-90 text-4xl text-white">
      {Math.floor(time / 60)}:{time % 60 < 10 && "0"}
      {time % 60}
      ({damage})
    </div>
  );
}
