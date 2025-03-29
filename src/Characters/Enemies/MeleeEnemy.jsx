import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { follow } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";

export default function MeleeEnemy({
  id,
  playerRef,
  position,
  handleMeleeEnemyCollision,
  showIndicator,
}) {
  const enemyRef = useRef();
  const visualRef = useRef();
  const speed = 3;
  const smoothingFactor = 0.1;

  useFrame(() => {
    if (playerRef.current && enemyRef.current && !showIndicator) {
      const playerPos = playerRef.current.translation();
      const enemyPos = enemyRef.current.translation();
      const targetVelObj = follow(playerPos, enemyPos, speed);
      const targetVelocity = new Vector3(
        targetVelObj.x,
        targetVelObj.y,
        targetVelObj.z
      );
      const currentVelocity = enemyRef.current.linvel();
      const newVelocity = new Vector3()
        .copy(currentVelocity)
        .lerp(targetVelocity, smoothingFactor);
      enemyRef.current.setLinvel(
        { x: newVelocity.x, y: newVelocity.y, z: newVelocity.z },
        true
      );

      if (visualRef.current) {
        const direction = new Vector3(
          playerPos.x - enemyPos.x,
          0,
          playerPos.z - enemyPos.z
        ).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        visualRef.current.rotation.y = angle;
      }
    }
  });

  return (
    <RigidBody
      key={showIndicator ? "indicator" : "active"}
      ref={enemyRef}
      name={`Enemy-${id}`}
      position={position}
      colliders={showIndicator ? false : "cuboid"}
      type="dynamic"
      gravityScale={0}
      collisionGroups={
        showIndicator
          ? interactionGroups(0, [])
          : interactionGroups(1, [0, 1, 2, 4])
      }
      lockRotations
      onCollisionEnter={({ manifold, target, other }) =>
        handleMeleeEnemyCollision(manifold, target, other, id)
      }
    >
      <group ref={visualRef}>
        <mesh castShadow>
          {showIndicator ? (
            <>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="red" transparent opacity={0.4} />
            </>
          ) : (
            <>
              <boxGeometry />
              <meshStandardMaterial color="green" />
            </>
          )}
        </mesh>
        <mesh position={[0.25, 0.2, 0.51]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial color='white' />
      </mesh>
      <mesh position={[0.22, 0.15, 0.52]}>
        <circleGeometry args={[0.08, 12]} />
        <meshStandardMaterial color='black' />
      </mesh>
      <mesh position={[-0.25, 0.2, 0.51]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial color='white' />
      </mesh>
      <mesh position={[-0.22, 0.15, 0.52]}>
        <circleGeometry args={[0.08, 12]} />
        <meshStandardMaterial color='black' />
      </mesh>
      <mesh position={[-0.22, 0.3, 0.52]} rotation={[0, 0, 2.7]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color='black' />
      </mesh>
      <mesh position={[0.22, 0.3, 0.52]} rotation={[0, 0, -2.7]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color='black' />
      </mesh>
      </group>
    </RigidBody>
  );
}
