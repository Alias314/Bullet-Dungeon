import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export function CameraController({ playerRef, mouse, isShoot }) {
  const { camera } = useThree();
  const cameraRef = useRef();
  const initialCameraRotation = useRef(0);

  useEffect(() => {
    cameraRef.current = camera;
    initialCameraRotation.current = camera.rotation.x;
  }, [camera]);
  
  useFrame(() => {
    if (playerRef.current) {
      const playerPos = playerRef.current.translation();

      const baseTarget = new Vector3(
        playerPos.x,
        camera.position.y,
        playerPos.z + 8
      );
      
      const panOffset = new Vector3(mouse.x, 0, -mouse.y).multiplyScalar(3);
      const targetPos = baseTarget.add(panOffset);
      camera.position.lerp(targetPos, 0.1);
    }
  });
  
  useEffect(() => {
    if (isShoot.current && cameraRef.current) {
      gsap.fromTo(
        cameraRef.current.rotation,
        {
          x: initialCameraRotation.current,
        },
        {
          x: initialCameraRotation.current + 0.01,
          duration: 0.05,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }
  }, [isShoot.current]);

  return null;
}
