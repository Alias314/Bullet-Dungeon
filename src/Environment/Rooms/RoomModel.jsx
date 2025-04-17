import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { interactionGroups } from "@react-three/rapier";
import React from "react";
import useRoomWaveSpawner from "../Logic/useRoomWaveSpawner"; // adjust path as neededt";

export default function RoomModel({
  position,
  playerRef,
  openings,
  amountEnemy,
  setAmountEnemy,
  setEnemies,
  setShowRoomClear,
}) {
  const roomDimensions = [25, 1, 20];
  const [roomWidth, , roomDepth] = roomDimensions;
  const offset = 0.5;
  const distanceToView = 24;
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;
  const maxWavesRef = useRef(Math.floor(Math.random() * 3) + 1);

  useRoomWaveSpawner({
    playerPos,
    position,
    roomDimensions,
    roomWidth,
    roomDepth,
    amountEnemy,
    setEnemies,
    setAmountEnemy,
    setShowRoomClear,
    maxWavesRef,
  });
  const { scene } = useGLTF("/assets/models/room3.glb");

  return (
    <group>
      {/* Room model */}
      <primitive object={scene} position={[0, 1.3, 0]} scale={3} />

      {/* Left wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        <mesh position={[-13.6, 0, 0]}>
          <boxGeometry args={[0.2, 6, 23]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        <mesh position={[13.6, 0, 0]}>
          <boxGeometry args={[0.2, 6, 23]} />
          <meshBasicMaterial color="green" wireframe />
        </mesh>
      </RigidBody>

      {/* Back wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        <mesh position={[0, 0, -10.3]}>
          <boxGeometry args={[28, 6, 0.2]} />
          <meshBasicMaterial color="blue" wireframe />
        </mesh>
      </RigidBody>

      {/* Front wall */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
      >
        <mesh position={[0, 0, 11]}>
          <boxGeometry args={[28, 6, 0.2]} />
          <meshBasicMaterial color="cyan" wireframe />
        </mesh>
      </RigidBody>
    </group>
  );
}
