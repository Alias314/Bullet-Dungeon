import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function Pistol({ position, isDroppedWeapon, isShoot }) {
  const localTime = useRef(0);
  const meshRef = useRef(null);
  const recoil = useRef(0);

  useFrame((_, delta) => {
    /* ─── Trigger a recoil when the flag flips to true ─── */
    if (isShoot.current && recoil.current === 0) {
      recoil.current = 1; // start animation
      isShoot.current = false; // consume the trigger
    }

    /* ─── Animate the recoil, then return to idle ─── */
    if (recoil.current > 0) {
      recoil.current = Math.max(0, recoil.current - delta * 8); // 0.125 s

      const kick = Math.sin(recoil.current * Math.PI); // ease
      if (meshRef.current) {
        meshRef.current.rotation.x = -0.35 * kick; // tilt back
        meshRef.current.position.z = -0.05 * kick; // slide back
      }
    } else if (meshRef.current) {
      /* ensure gun is perfectly reset */
      meshRef.current.rotation.x = 0;
      meshRef.current.position.z = 0;
    }

    if (meshRef.current && isDroppedWeapon) {
      localTime.current += delta;
      meshRef.current.rotation.y = localTime.current;
    }
  });

  const { scene: knightGun } = useGLTF("/assets/models/knightGun.glb");
  return (
    <primitive
      ref={meshRef}
      object={knightGun}
      position={[0.65, 0.1, 0]}
      rotation={[0, 0.1, 0]}
      scale={0.7}
    />
  );
}
