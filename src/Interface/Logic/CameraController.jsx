import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function CameraController({ playerRef, mouse }) {
  useFrame(({ camera }) => {
    if (playerRef.current) {
      const playerPos = playerRef.current.translation();
      // Base camera target: directly behind the player
      const baseTarget = new Vector3(
        playerPos.x,
        camera.position.y,
        playerPos.z + 8
      );
      // Create an offset based on the mouse position.
      // Adjust the multiplier (2 here) to change panning strength.
      const panOffset = new Vector3(mouse.x, 0, -mouse.y).multiplyScalar(3);
      const targetPos = baseTarget.add(panOffset);
      camera.position.lerp(targetPos, 0.1);
    }
  });

  return null;
}
