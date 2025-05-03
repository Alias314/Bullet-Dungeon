import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  CuboidCollider,
  interactionGroups,
} from "@react-three/rapier";

export default function FireAura({ playerRef }) {
  const meshRef = useRef();
  const playerPos = playerRef.current ? playerRef.current.translation() : null;

  useFrame(() => {
    if (playerRef.current && meshRef.current) {
      meshRef.current.setTranslation(playerRef.current.translation());
    }
  });

  return (
    <RigidBody
      ref={meshRef}
      name="PlayerShield"
      type="kinematicPosition"
      colliders={false}
      gravityScale={0}
      collisionGroups={interactionGroups(0, [3])}
    >
      <CuboidCollider args={[2, 2, 2]} />
      <mesh>
        <octahedronGeometry args={[8, 3]} />
        <meshStandardMaterial color="red" transparent opacity={0.2} />
      </mesh>
    </RigidBody>
  );
}
