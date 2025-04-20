import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

export default function MachineGun({
  position = [0.7, 0, 0.4],
  currentWeapon,
  isShoot,
}) {
  const machineGunBarrelRef = useRef(null);

  useEffect(() => {
    if (isShoot.current && machineGunBarrelRef.current) {
      gsap.fromTo(
        machineGunBarrelRef.current.rotation,
        { z: 0 },
        { z: 2 * Math.PI, duration: 0.35 }
      );
    }
    isShoot.current = false;
  }, [isShoot.current]);

  const { scene: machineGunBarrel } = useGLTF(
    "/assets/models/machineGunBarrel.glb"
  );
  const { scene: machineGunBody } = useGLTF(
    "/assets/models/machineGunBody.glb"
  );
  return (
    <group>
      <primitive
        ref={machineGunBarrelRef}
        object={machineGunBarrel}
        position={
          currentWeapon !== "machineGun"
            ? [position[0], position[1] + 1.2, position[2] + 0.68]
            : [0.7, 0, 0.4 + 0.68]
        }
        scale={0.65}
      />
      <primitive
        object={machineGunBody}
        position={
          currentWeapon !== "machineGun"
            ? [position[0], position[1] + 1.2, position[2] - 0.68]
            : [0.7, 0, 0.4 - 0.68]
        }
        scale={0.65}
      />
    </group>
  );
}
