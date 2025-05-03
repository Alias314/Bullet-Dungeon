import { useEffect, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-35 top-90 text-4xl text-white">
      {Math.floor(time / 60)}:{time % 60 < 10 && "0"}
      {time % 60}
    </div>
  );
}
