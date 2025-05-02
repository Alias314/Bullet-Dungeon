import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import * as THREE from "three";
import gsap from "gsap";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { CuboidCollider } from "@react-three/rapier";

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

  useEffect(() => {
    let intervalId;
    let shootTimeoutId;
    const initialDelay = Math.random() * 1000;

    const startCycle = () => {
      setEnemyState("follow");
      setSpeed(2.5);
      shootTimeoutId = setTimeout(() => {
        setEnemyState("shoot");
        setSpeed(2);
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
          let bulletSpread = Math.random() * 3;
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

  const visualRef = useRef(null);
  const { scene: enemySwordBody } = useGLTF(
    "/assets/models/enemySwordBody.glb"
  );
  const { scene: enemySwordHead } = useGLTF(
    "/assets/models/enemyMachineGunHead.glb"
  );
  const { scene: sword } = useGLTF("/assets/models/uzi.glb");
  const modelEnemySwordBody = useMemo(
    () => clone(enemySwordBody),
    [enemySwordBody]
  );
  const modelEnemySwordHead = useMemo(
    () => clone(enemySwordHead),
    [enemySwordHead]
  );
  const modelSword = useMemo(() => clone(sword), [sword]);
  const enemySwordHeadRef = useRef(null);
  const swordRef = useRef(null);

  useEffect(() => {
    if (enemySwordHeadRef.current) {
      gsap.fromTo(
        enemySwordHeadRef.current.position,
        { y: enemySwordHeadRef.current.position.y },
        {
          y: enemySwordHeadRef.current.position.y + 0.1,
          duration: 0.35,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        }
      );
    }
  }, [enemySwordHeadRef.current]);

  return (
    <RigidBody
      key={showIndicator ? "indicator" : "active"}
      ref={enemyRef}
      name={`Enemy-${id}`}
      position={position}
      colliders={false}
      type="dynamic"
      gravityScale={0}
      collisionGroups={
        showIndicator
          ? interactionGroups(0, [])
          : interactionGroups(1, [0, 1, 2, 4])
      }
      lockRotations
    >
      <mesh ref={visualRef} castShadow>
        {showIndicator ? (
          <>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="red" transparent opacity={0.4} />
          </>
        ) : (
          <>
            <primitive
              object={modelEnemySwordBody}
              scale={0.5}
              position={[0, 0, 0]}
              dispose={null}
            />
            <primitive
              ref={enemySwordHeadRef}
              object={modelEnemySwordHead}
              scale={0.5}
              position={[0, 0.65, 0]}
              dispose={null}
            />
            <primitive
              ref={swordRef}
              object={modelSword}
              scale={0.7}
              position={[0.575, 0, 0.3]}
              dispose={null}
            />
          </>
        )}
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}
