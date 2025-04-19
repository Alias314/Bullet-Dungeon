import { useEffect, useRef, useState } from "react";
import { summonEnemies, delay } from "../../Utils/Helper";

export default function useRoomWaveSpawner({
  playerPos,
  position,
  roomDimensions,
  roomWidth,
  roomDepth,
  amountEnemy,
  setEnemies,
  setAmountEnemy,
  setShowRoomClear,
  maxWavesRef
}) {
  // wave state starts at 0; once the first wave spawns, set to 1.
  const [wave, setWave] = useState(0);
  // Flag to indicate that a wave is currently being spawned
  const [isSpawning, setIsSpawning] = useState(false);

  // Helper: compute absolute distances from room center
  function computeAbsDistance() {
    if (!playerPos) return { x: Infinity, z: Infinity };
    return {
      x: Math.abs(position[0] - playerPos.x),
      z: Math.abs(position[2] - playerPos.z),
    };
  }
  
  // Spawn subsequent waves when the current wave is cleared.
  useEffect(() => {
    if (!playerPos) return;
    const { x, z } = computeAbsDistance();
    if (
      x <= roomWidth / 2 - 3 &&
      z <= roomDepth / 2 - 3 &&
      wave < maxWavesRef.current &&
      amountEnemy === 0 &&
      !isSpawning // only spawn if no wave is already being processed
    ) {
      setIsSpawning(true);
      const newEnemies = summonEnemies(roomDimensions, position, setAmountEnemy).map(
        enemy => ({ ...enemy, showIndicator: true })
      );
      setEnemies(newEnemies);
      setWave(prev => prev + 1);
      delay(1000).then(() => {
        setEnemies(prevEnemies =>
          prevEnemies.map(enemy => ({ ...enemy, showIndicator: false }))
        );
        setIsSpawning(false);
      });
    }
    // console.log("Wave:", wave, "Max:", maxWavesRef.current);
  }, [amountEnemy, playerPos, wave, position, roomDimensions, setEnemies, setAmountEnemy, roomWidth, roomDepth, isSpawning]);

  // When the final wave is cleared, trigger the room clear overlay.
  useEffect(() => {
    // Only trigger if we're not in the middle of a spawn
    if (!isSpawning && wave === maxWavesRef.current && amountEnemy === 0) {
      setShowRoomClear(true);
    }
  }, [amountEnemy, wave, isSpawning, setShowRoomClear]);
}
