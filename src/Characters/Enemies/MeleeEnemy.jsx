import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow, stalk, runAway, wander } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";

export default function MeleeEnemy({
  id,
  playerRef,
  position,
  handleMeleeEnemyCollision,
}) {
  const enemyRef = useRef();
  const speed = 3;
  const smoothingFactor = 0.1;

  useFrame(() => {
    if (playerRef.current && enemyRef.current) {
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
    }
  });

  return (
    <>
      <RigidBody
        ref={enemyRef}
        name={`Enemy-${id}`}
        position={position}
        colliders="cuboid"
        type="dynamic"
        gravityScale={0}
        collisionGroups={interactionGroups(1, [0, 1, 2, 4])}
        lockRotations
        onCollisionEnter={({ manifold, target, other }) => {
          handleMeleeEnemyCollision(manifold, target, other, id);
        }}
      >
        <mesh castShadow>
          <boxGeometry />
          <meshStandardMaterial color={"green"} />
        </mesh>
      </RigidBody>
    </>
  );
}
