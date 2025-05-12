import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { usePlayerStore } from "../../Interface/Logic/usePlayerStore";
import { pre } from "framer-motion/client";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function SpikeTrap({ isUsed, position }) {
  const playerRef = usePlayerStore((state) => state.playerRef);
  const increaseStat = usePlayerStore((state) => state.increaseStat);
  const { scene: spikeTrapUsed } = useGLTF("/assets/models/spikeTrapUsed.glb");
  const { scene: spikeTrapNotUsed } = useGLTF(
    "/assets/models/spikeTrapNotUsed.glb"
  );
  const setIsInvincible = usePlayerStore((state) => state.setIsInvincible);
  const trapUsed = useMemo(() => clone(spikeTrapUsed),  [spikeTrapUsed]);
  const trapIdle = useMemo(() => clone(spikeTrapNotUsed),  [spikeTrapNotUsed]);
  
  const distanceToTrigger = 1;
  
  useEffect(() => {
    const interval = setInterval(() => {
      const playerTranslation =
      playerRef && playerRef.current ? playerRef.current.translation() : null;
      const playerPos = [playerTranslation.x, 1, playerTranslation.z];
      const distance = [
        Math.abs(playerPos[0] - position[0]),
        Math.abs(playerPos[2] - position[2]),
      ];
      const isInvincible = usePlayerStore.getState().isInvincible;

      if (
        isUsed &&
        !isInvincible &&
        distance[0] < distanceToTrigger &&
        distance[1] < distanceToTrigger
      ) {
        increaseStat("health", -1);
        setIsInvincible(true);

        const timeout = setTimeout(() => {
          setIsInvincible(false);
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isUsed]);

  return (
    <>
      {isUsed ? (
        <primitive
          object={trapUsed}
          scale={0.5}
          position={[position[0], 0.6, position[2] + 0.5]}
        />
      ) : (
        <primitive
          object={trapIdle}
          scale={0.5}
          position={[position[0], 0.38, position[2] + 0.5]}
        />
      )}
    </>
  );
}
