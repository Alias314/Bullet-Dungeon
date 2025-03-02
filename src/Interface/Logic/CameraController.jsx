import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function CameraController({ playerRef }) {
  useFrame(({ camera }) => {
    if (playerRef.current) {
      const playerPos = playerRef.current.translation();
      const targetPos = new Vector3(
        playerPos.x,
        camera.position.y,
        playerPos.z + 8
      );
      camera.position.lerp(targetPos, 0.1);
    }
  });
  return null;
}
