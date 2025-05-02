import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import MuzzleFlash from "./MuzzleFlash";

export default function Pistol({
  position = [0.65, 0.1, 0],
  currentWeapon,
  isShoot = false,
}) {
  const meshRef = useRef(null);
  const { scene: knightGun } = useGLTF("/assets/models/knightGun.glb");

  useEffect(() => {
    if (isShoot.current && meshRef.current) {
      gsap.fromTo(
        meshRef.current.position,
        { z: 0 },
        { z: -0.2, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
      gsap.fromTo(
        meshRef.current.rotation,
        { x: 0 },
        { x: -0.2, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
      isShoot.current = false;
    }
  }, [isShoot.current]);

  useEffect(() => {
    if (currentWeapon !== "pistol" && meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: "+=" + 2 * Math.PI,
        duration: 15,
        repeat: -1,
        ease: "none",
      });
      gsap.fromTo(
        meshRef.current.position,
        { y: 0 },
        { y: 0.5, duration: 1, yoyo: true, repeat: -1, ease: "power1.inOut" }
      );
    } else {
      gsap.killTweensOf(meshRef.current.rotation);
      gsap.killTweensOf(meshRef.current.position);
      meshRef.current.rotation.y = 0;
      meshRef.current.position.y = 0;
    }
  }, [currentWeapon]);

  return (
    <group
      position={
        currentWeapon !== "pistol"
          ? [position[0], position[1] + 1.2, position[2]]
          : [0.65, 0.1, 0]
      }
      rotation={[0, 0.1, 0]}
    >
      <primitive ref={meshRef} object={knightGun} scale={0.7} />
    </group>
  );
}
