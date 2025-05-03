import React, { useEffect, useState } from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import MachineGun from "../Items/MachineGun";
import Pistol from "../Items/Pistol";
import Shotgun from "../Items/Shotgun";
import { useGLTF } from "@react-three/drei";

export default function TreasureChest({
  position,
  absoluteDistance,
  playerPos,
  currentWeapon,
  setCurrentWeapon,
  treasureState,
  setTreasureState,
  isShoot,
}) {
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/textures/chest_front.png"
  );
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  const proximityThreshold = 3;
  const [isOpen, setIsOpen] = useState(false);

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
          setIsOpen(true);
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

  const { scene: treasureChestClosed } = useGLTF(
    "/assets/models/treasureChestClosed.glb"
  );
  const { scene: treasureChestOpen } = useGLTF(
    "/assets/models/treasureChestOpen.glb"
  );

  return (
    <>
      <RigidBody
        name="Obstacle"
        type="fixed"
        colliders="cuboid"
        position={position}
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        {isOpen ? (
          <primitive object={treasureChestOpen} scale={0.55} position={[0, 0.2, 0]} />
        ) : (
          <primitive object={treasureChestClosed} scale={0.55} position={[0, 0.2, 0]} />
        )}
      </RigidBody>

      {treasureState.isGunDropped && (
        <>
          {treasureState.chestGun === "machineGun" && (
            <MachineGun
              key={2}
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
            <Shotgun key={3} position={position} playerPos={playerPos} />
          )}
        </>
      )}
    </>
  );
}
