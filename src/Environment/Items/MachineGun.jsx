import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

export default function MachineGun({
  position,
  currentWeapon,
  isShoot,
}) {
  const machineGunBarrelRef = useRef(null);
  const wholeGunRef = useRef(null);

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

  useEffect(() => {
    if (currentWeapon !== "machineGun" && wholeGunRef.current) {
      gsap.to(wholeGunRef.current.rotation, {
        y: "+=" + 2 * Math.PI,
        duration: 15,
        repeat: -1,
        ease: "none",
      });
      gsap.fromTo(
        wholeGunRef.current.position,
        { y: 0 },
        { y: 0.5, duration: 1, yoyo: true, repeat: -1, ease: "power1.inOut" }
      );
    } else {
      gsap.killTweensOf(wholeGunRef.current.rotation);
      gsap.killTweensOf(wholeGunRef.current.position);
      wholeGunRef.current.rotation.y = 0;
      wholeGunRef.current.position.y = 0;
    }
  }, [currentWeapon]);

  const { scene: machineGunBarrel } = useGLTF(
    "/assets/models/machineGunBarrel.glb"
  );
  const { scene: machineGunBody } = useGLTF(
    "/assets/models/machineGunBody.glb"
  );

  return (
    <group
      position={
        currentWeapon !== "machineGun"
          ? [position[0], position[1] + 1.2, position[2] + 0.68]
          : [0.7, 0, 0.4]
      }
    >
      <group ref={wholeGunRef}>
        <primitive
          ref={machineGunBarrelRef}
          object={machineGunBarrel}
          position={[0, 0, 0.68]}
          scale={0.65}
        />
        <primitive
          object={machineGunBody}
          position={[0, 0, -0.68]}
          scale={0.65}
        />
      </group>
    </group>
      // <mesh ref={wholeGunRef} position={position}>
      //   <boxGeometry args={[2, 2, 2]} />
      //   <meshStandardMaterial color={'white'} />
      // </mesh>
  );
}
