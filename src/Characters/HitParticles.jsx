import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { Vector3 } from "three";

const randomDirection = () => {
  const speed = 5;
  const v = new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  );
  return v.normalize().multiplyScalar(speed);
};

function Particle({ position, color }) {
  const meshSize = 0.1;
  const mesh = useRef();
  const vel = useMemo(() => randomDirection(0.5), []);

  useFrame((_, delta) => {
    mesh.current.position.addScaledVector(vel, delta);
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[meshSize, meshSize, meshSize]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function HitParticles({ position, color, removeHitParticles }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
        removeHitParticles();
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Particle key={i} position={position} color={color} />
      ))}
    </>
  );
}
