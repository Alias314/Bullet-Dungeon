import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import * as THREE from "three";

export default function GatlingEnemy({
  id,
  playerRef,
  position,
  setEnemyBullets,
  showIndicator,
  handleMeleeEnemyCollision,
}) {
  const [speed, setSpeed] = useState(1.7);
  const [enemyState, setEnemyState] = useState("follow"); // "follow" or "shoot"
  const enemyRef = useRef();
  const localTime = useRef(0);
  const meshRef = useRef();
  const shootAudioRef = useRef();
  useEffect(() => {
    shootAudioRef.current = new Audio(
      "assets/audio/Retro_Gun_SingleShot_04.wav"
    );
  }, []);

  // Movement: When not showing indicator, follow the player.
  useFrame((_, delta) => {
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
      const smoothingFactor = 0.1;
      const newVelocity = new Vector3()
        .copy(currentVelocity)
        .lerp(targetVelocity, smoothingFactor);
      enemyRef.current.setLinvel(
        { x: newVelocity.x, y: newVelocity.y, z: newVelocity.z },
        true
      );

      if (meshRef.current) {
        localTime.current += delta * 0.5;
        meshRef.current.rotation.y = localTime.current;
        meshRef.current.rotation.x = localTime.current;
      }
    }
  });

  // Enemy state cycle: randomly delay the start so not all enemies sync up.
  useEffect(() => {
    let intervalId;
    let shootTimeoutId;
    const initialDelay = Math.random() * 5000; // Random delay up to 5s

    const startCycle = () => {
      // Set to "follow" for 2 seconds
      setEnemyState("follow");
      setSpeed(1.7);
      shootTimeoutId = setTimeout(() => {
        // Then switch to "shoot" for the remainder of the cycle
        setEnemyState("shoot");
        setSpeed(0.75);
      }, 2000);
    };

    const timeoutId = setTimeout(() => {
      startCycle();
      intervalId = setInterval(() => {
        startCycle();
      }, 5000);
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(shootTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Shooting logic: Only when in "shoot" state and not in indicator mode.
  useEffect(() => {
    let shootingInterval;
    if (enemyState === "shoot" && !showIndicator) {
      shootingInterval = setInterval(() => {
        if (shootAudioRef.current) {
          const soundClone = shootAudioRef.current.cloneNode();
          soundClone.volume = 0.2;
          soundClone.play();
        }
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
      if (shootingInterval) clearInterval(shootingInterval);
    };
  }, [enemyState, playerRef, setEnemyBullets, showIndicator]);

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
    >
      <mesh castShadow>
        {showIndicator ? (
          <>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="red" transparent opacity={0.4} />
          </>
        ) : (
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[0.8]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        )}
      </mesh>
    </RigidBody>
  );
}
