import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useRef } from "react";

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
        <meshStandardMaterial color="orange" />
      </mesh>

      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(...size)]}
        />
        <lineBasicMaterial attach="material" color="white" linewidth={2} />
      </lineSegments>
    </RigidBody>
  );
}