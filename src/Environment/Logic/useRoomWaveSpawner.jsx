import { useEffect, useRef, useState } from "react";
import { summonEnemies } from "../../Utils/helper";
import { delay } from "../../Utils/helper";

/**
 * useRoomWaveSpawner
 *
 * This hook spawns enemy waves when the player is near the room.
 * It accepts:
 * - playerPos: The player's position (from playerRef.translation())
 * - position: The room's center position
 * - roomDimensions: An array [roomWidth, _, roomDepth]
 * - roomWidth, roomDepth: Precomputed room width and depth
 * - amountEnemy: The current enemy count in the room
 * - setEnemies: Setter for the enemy array
 * - setAmountEnemy: Setter for the enemy count (usually called within summonEnemies)
 */
export default function useRoomWaveSpawner({
  playerPos,
  position,
  roomDimensions,
  roomWidth,
  roomDepth,
  amountEnemy,
  setEnemies,
  setAmountEnemy,
}) {
  // wave state starts at 0; once the first wave spawns, set to 1.
  const [wave, setWave] = useState(0);
  // Maximum waves for this room (randomly between 1 and 3)
  const maxWavesRef = useRef(Math.floor(Math.random() * 4) + 1);

  // Helper: compute absolute distances from room center
  function computeAbsDistance() {
    if (!playerPos) return { x: Infinity, z: Infinity };
    return {
      x: Math.abs(position[0] - playerPos.x),
      z: Math.abs(position[2] - playerPos.z),
    };
  }

  // Spawn the first wave when the player is close to the room center.
  useEffect(() => {
    if (!playerPos) return;
    const { x, z } = computeAbsDistance();
    // Use a tighter condition: player must be within (roomWidth/2 - 3) and (roomDepth/2 - 3)
    if (x <= roomWidth / 2 - 3 && z <= roomDepth / 2 - 3 && wave === 0) {
      const newEnemies = summonEnemies(roomDimensions, position, setAmountEnemy).map(
        enemy => ({ ...enemy, showIndicator: true })
      );
      setEnemies(newEnemies);
      setWave(1);
      delay(1000).then(() => {
        setEnemies(prevEnemies =>
          prevEnemies.map(enemy => ({ ...enemy, showIndicator: false }))
        );
      });
    }
  }, [playerPos, wave, position, roomDimensions, setEnemies, setAmountEnemy, roomWidth, roomDepth]);

  // When the current wave is cleared and if more waves remain, spawn the next wave.
  useEffect(() => {
    if (!playerPos) return;
    const { x, z } = computeAbsDistance();
    if (
      x <= roomWidth / 2 - 3 &&
      z <= roomDepth / 2 - 3 &&
      wave > 0 &&
      wave < maxWavesRef.current &&
      (!amountEnemy || amountEnemy === 0)
    ) {
      const newEnemies = summonEnemies(roomDimensions, position, setAmountEnemy).map(
        enemy => ({ ...enemy, showIndicator: true })
      );
      setEnemies(newEnemies);
      setWave(prev => prev + 1);
      delay(1000).then(() => {
        setEnemies(prevEnemies =>
          prevEnemies.map(enemy => ({ ...enemy, showIndicator: false }))
        );
      });
    }
  }, [amountEnemy, playerPos, wave, position, roomDimensions, setEnemies, setAmountEnemy, roomWidth, roomDepth]);
}
