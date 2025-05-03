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
  const [wave, setWave] = useState(0);
  const [isSpawning, setIsSpawning] = useState(false);

  function computeAbsDistance() {
    if (!playerPos) return { x: Infinity, z: Infinity };
    return {
      x: Math.abs(position[0] - playerPos.x),
      z: Math.abs(position[2] - playerPos.z),
    };
  }
  
  useEffect(() => {
    if (!playerPos) return;
    const { x, z } = computeAbsDistance();
    if (
      x <= roomWidth / 2 - 3 &&
      z <= roomDepth / 2 - 3 &&
      wave < maxWavesRef.current &&
      amountEnemy === 0 &&
      !isSpawning
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
  }, [amountEnemy, playerPos, wave, position, roomDimensions, setEnemies, setAmountEnemy, roomWidth, roomDepth, isSpawning]);

  useEffect(() => {
    if (!isSpawning && wave === maxWavesRef.current && amountEnemy === 0) {
      setShowRoomClear(true);
    }
  }, [amountEnemy, wave, isSpawning, setShowRoomClear]);
}
