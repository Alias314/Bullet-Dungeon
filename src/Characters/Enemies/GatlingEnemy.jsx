import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow, stalk, runAway, wander } from "../Logic/EnemyBehavior";
import { Vector3 } from "three";

export default function GatlingEnemy({ id, playerRef, position, setEnemyBullets }) {
  const [time, setTime] = useState(0);
  const enemyRef = useRef();
  const [speed, setSpeed] = useState(1.7);
  const [enemyState, setEnemyState] = useState("follow");

  useFrame(() => {
    if (playerRef.current && enemyRef.current) {
      const playerPos = playerRef.current.translation();
      const enemyPos = enemyRef.current.translation();
      let velocity;

      velocity = follow(playerPos, enemyPos, speed);

      enemyRef.current.setLinvel(velocity, true);
    }
  });

  useEffect(() => {
    let interval = null;

    setTimeout(() => {}, Math.random() * 1000);

    if (enemyState === "shoot") {
      interval = setInterval(() => {
        if (playerRef.current && enemyRef.current) {
          const playerPos = playerRef.current.translation();
          const enemyPos = enemyRef.current.translation();
          const bulletSpeed = 10;
          let bulletSpread = Math.random() * 10;
          bulletSpread = bulletSpread - bulletSpread / 2;
          const direction = new Vector3(
            playerPos.x - enemyPos.x + bulletSpread,
            playerPos.y - enemyPos.y,
            playerPos.z - enemyPos.z + bulletSpread
          ).normalize();
          const velocity = {
            x: direction.x * bulletSpeed,
            y: direction.y * bulletSpeed,
            z: direction.z * bulletSpeed,
          };

          setEnemyBullets((prev) => [
            ...prev,
            {
              id: Math.random(),

              position: [enemyPos.x, enemyPos.y, enemyPos.z],
              velocity,
            },
          ]);
        }
      }, 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, [playerRef, enemyRef, enemyState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEnemyState("follow");
      setSpeed(1.7);

      const timeoutId = setTimeout(() => {
        setEnemyState("shoot");
        setSpeed(0.75);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

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
          <meshStandardMaterial color={"purple"} />
        </mesh>
      </RigidBody>
    </>
  );
}