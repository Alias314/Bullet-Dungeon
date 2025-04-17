import React, { useEffect } from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import MachineGun from "../Items/MachineGun";
import Pistol from "../Items/Pistol";
import Shotgun from "../Items/Shotgun"

export default function TreasureChest({
  position,
  absoluteDistance,
  playerPos,
  currentWeapon,
  setCurrentWeapon,
  treasureState,
  setTreasureState,
}) {
  // Load chest texture.
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/textures/chest_front.png"
  );
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  // Now we use the lifted state:
  // treasureState: { isGunDropped: boolean, chestGun: string }
  const proximityThreshold = 3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "e" || e.key === "E") &&
        absoluteDistance &&
        absoluteDistance[0] <= proximityThreshold &&
        absoluteDistance[2] <= proximityThreshold
      ) {
        if (treasureState.isGunDropped) {
          // Swap the player's weapon with the chest's weapon.
          const temp = currentWeapon;
          setCurrentWeapon(treasureState.chestGun);
          setTreasureState((prev) => ({ ...prev, chestGun: temp }));
          console.log(currentWeapon);
        } else {
          // Drop the gun (if it hasn't been dropped yet).
          setTreasureState((prev) => ({ ...prev, isGunDropped: true }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    absoluteDistance,
    currentWeapon,
    treasureState,
    setCurrentWeapon,
    setTreasureState,
  ]);

  return (
    <>
      <RigidBody
        name="Obstacle"
        type="fixed"
        colliders="cuboid"
        position={position}
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </RigidBody>

      {treasureState.isGunDropped && (
        <>
          {treasureState.chestGun === "machineGun" && (
            <MachineGun position={position} playerPos={playerPos} />
          )}
          {treasureState.chestGun === "pistol" && (
            <Pistol position={position} isDroppedWeapon={true} isShoot={false} />
          )}
          {treasureState.chestGun === "shotgun" && (
            <Shotgun position={position} playerPos={playerPos} />
          )}
        </>
      )}
    </>
  );
}
