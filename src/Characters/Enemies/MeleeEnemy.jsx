import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow, stalk, runAway, wander } from "../Logic/EnemyBehavior";
import { Vector3 } from "three";

export default function MeleeEnemy({ id, playerRef, position }) {
  const enemyRef = useRef();
  const speed = 3;

  useFrame(() => {
    if (playerRef.current && enemyRef.current) {
      const playerPos = playerRef.current.translation();
      const enemyPos = enemyRef.current.translation();
      const velocity = follow(playerPos, enemyPos, speed);

      enemyRef.current.setLinvel(velocity, true);
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
      >
        <mesh castShadow>
          <boxGeometry />
          <meshStandardMaterial color={"green"} />
        </mesh>
      </RigidBody>
    </>
  );
}