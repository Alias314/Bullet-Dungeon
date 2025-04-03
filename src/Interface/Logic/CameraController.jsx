import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function CameraController({ playerRef, mouse, shakeRef }) {
  // shakeRef.current = 0.1;

  useFrame(({ camera }) => {
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

      if (shakeRef.current > 0.001) {
        const shakeOffset = new Vector3(
          (Math.random() - 0.5) * shakeRef.current,
          (Math.random() - 0.5) * shakeRef.current,
          (Math.random() - 0.5) * shakeRef.current
        );
        camera.position.add(shakeOffset);
        shakeRef.current *= 0.5;
      }
    }
  });

  return null;
}
