import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MuzzleFlash({ position, isShoot }) {
  const meshRef = useRef(null);

  useEffect(() => {
    if (isShoot.current && meshRef.current) {
      gsap.fromTo(
        meshRef.current.material,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration: 1,
          ease: "power1.in",
        }
      );
    }
  }, [isShoot.current]);

  return (

    <mesh ref={meshRef} position={[position[0], position[0], position[0]]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="orange"
        emissive="red"
        emissiveIntensity={0.7}
      />
    </mesh>
  );
}
