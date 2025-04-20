import React, { useEffect } from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import MachineGun from "../Items/MachineGun";
import Pistol from "../Items/Pistol";
import Shotgun from "../Items/Shotgun";

export default function TreasureChest({
  position,
  absoluteDistance,
  playerPos,
  currentWeapon,
  setCurrentWeapon,
  treasureState,
  setTreasureState,
  isShoot
}) {
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/textures/chest_front.png"
  );
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

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
          const temp = currentWeapon;
          setCurrentWeapon(treasureState.chestGun);
          setTreasureState((prev) => ({ ...prev, chestGun: temp }));
        } else {
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
            <MachineGun
              key={Math.random()}
              position={position}
              currentWeapon={currentWeapon}
              isShoot={isShoot}
            />
          )}
          {treasureState.chestGun === "pistol" && (
            <Pistol
              key={1}
              position={position}
              currentWeapon={currentWeapon}
              isShoot={isShoot}
            />
          )}
          {treasureState.chestGun === "shotgun" && (
            <Shotgun
              key={Math.random()}
              position={position}
              playerPos={playerPos}
            />
          )}
        </>
      )}
    </>
  );
}
