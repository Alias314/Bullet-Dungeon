import { useEffect, useState } from "react";
import SpikeTrap from "../Obstacles/SpikeTrap";
import WoodenBox from "../Obstacles/WoodenBox";

const getRandomPos = (position, roomDimensions) => {
  const margin = 2;
  const x = Math.floor(
    Math.random() * (roomDimensions[0] - 2 * margin) -
      (roomDimensions[0] - 2 * margin) / 2 +
      position[0]
  );
  const y = 2;
  const z = Math.floor(
    Math.random() * (roomDimensions[2] - 2 * margin) -
      (roomDimensions[2] - 2 * margin) / 2 +
      position[2]
  );
  return [x + 0.5, y, z + 0.025];
};

export default function CreateObstacles({ position, roomDimensions }) {
  const amount = 15;

  const [layout] = useState(() =>
    [...Array(amount)].map(() => {
      const pos = getRandomPos(position, roomDimensions);
      const type = Math.random() < 0.5 ? "trap" : "box";
      return { pos, type };
    })
  );

  const [isUsed, setIsUsed] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setIsUsed((p) => !p), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {layout.map(({ pos, type }, i) =>
        type === "trap" ? (
          <SpikeTrap key={i} isUsed={isUsed} position={pos} />
        ) : (
          <WoodenBox key={i} position={[pos[0], pos[1] - 1, pos[2] + 0.5]} />
        )
      )}
    </>
  );
}
