import React from "react";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import Floor from "../Floor";
import WallsAndGates from "../Logic/CreateWallsAndGates";
import { generateLayout } from "../GenerateLayout";
import { Vector3 } from "three";
import { useRef } from "react";

export default function PortalRoom({
  position,
  playerRef,
  openings,
  amountEnemy,
  setLayout,
  level,
  setHasBeatLevel,
}) {
  const roomDimensions = [20, 1, 20];
  const [roomWidth, , roomDepth] = roomDimensions;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;
  const distanceToView = 24;

  return (
    <>
      {playerPos &&
        absoluteDistance &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <>
            <Floor roomDimensions={roomDimensions} position={position} />
            <WallsAndGates
              position={position}
              roomDimensions={roomDimensions}
              openings={openings}
              amountEnemy={amountEnemy}
            />

            <RigidBody
              type="fixed"
              colliders="cuboid"
              collisionGroups={interactionGroups(3, [0, 4])}
              onCollisionEnter={() => {
                playerRef.current.setTranslation(new Vector3(0, 1, 0));
                level.current++;
                setLayout(generateLayout(level.current));
                setHasBeatLevel(true);
              }}
            >
              <mesh position={[position[0], position[1] + 1, position[2]]}>
                <boxGeometry args={[4, 4, 4]} />
                <meshStandardMaterial
                  color="red"
                  emissive="hotpink"
                  emissiveIntensity={0.7}
                />
              </mesh>
            </RigidBody>
          </>
        )}
    </>
  );
}
