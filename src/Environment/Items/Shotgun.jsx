import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";

export default function Shotgun({ position, playerPos, currentGun, setCurrentGun }) {
  const localTime = useRef(0);
  const meshRef = useRef(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      localTime.current += delta;

      meshRef.current.rotation.y = localTime.current;
    }
  });

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1] + 1, position[2] + 1.5]}
    >
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh position={[-0.5, -0.5, 0]} rotation={[0, 0, 1]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.25]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}
