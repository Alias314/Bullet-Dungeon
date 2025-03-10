import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

export default function WallSegment({ position, size }) {
  return (
    <RigidBody
      name="Obstacle"
      type="fixed"
      colliders="cuboid"
      position={position}
      collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
    >
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </RigidBody>
  );
}
