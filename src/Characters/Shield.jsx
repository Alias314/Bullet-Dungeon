import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  CuboidCollider,
  interactionGroups,
} from "@react-three/rapier";
import { usePlayerStore } from "../Interface/Logic/usePlayerStore";

export default function Shield() {
  const meshRef = useRef();
  const playerRef = usePlayerStore((state) => state.playerRef);
  const ready = useRef(false);

  useFrame(() => {
    if (playerRef.current && meshRef.current) {
      meshRef.current.setTranslation(playerRef.current.translation());
      ready.current = true;
    }
  });

  return (
    <RigidBody
      ref={meshRef}
      name="PlayerShield"
      type="dynamic"
      colliders={false}
      position={[0, 0, 0]}
      gravityScale={0}
      collisionGroups={interactionGroups(0, [3])}
    >
      <CuboidCollider args={[2, 2, 2]} />
      <mesh visible={ready.current} position={[0, 0, 0]} >
        <octahedronGeometry args={[2, 3]} />
        <meshStandardMaterial color="orange" transparent opacity={0.2} />
      </mesh>
    </RigidBody>
  );
}
