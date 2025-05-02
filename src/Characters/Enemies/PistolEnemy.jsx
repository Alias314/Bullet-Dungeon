import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow, stalk, runAway, wander } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { CuboidCollider } from "@react-three/rapier";

export default function PistolEnemy({
  id,
  playerRef,
  position,
  setEnemyBullets,
  showIndicator,
}) {
  const [time, setTime] = useState(0);
  const enemyRef = useRef();
  const speed = 2.2;
  const distanceToWander = 100;
  const [positionToWander, setPositionToWander] = useState(null);
  const meshRef = useRef();
  const localTime = useRef(0);
  const shootAudioRef = useRef();
  useEffect(() => {
    shootAudioRef.current = new Audio(
      "assets/audio/Retro_Gun_SingleShot_04.wav"
    );
    shootAudioRef.current.volume = 0.2;
  }, []);

  useFrame((_, delta) => {
    if (
      playerRef.current &&
      enemyRef.current &&
      positionToWander &&
      !showIndicator
    ) {
      const playerPos = playerRef.current.translation();
      const enemyPos = enemyRef.current.translation();
      const absoluteDistance = [
        Math.abs(playerPos.x - enemyPos.x),
        0,
        Math.abs(playerPos.z - enemyPos.z),
      ];
      const distanceToStalk = 5;
      let targetVelocityObj;

      if (
        absoluteDistance[0] < distanceToStalk &&
        absoluteDistance[2] < distanceToStalk
      ) {
        targetVelocityObj = stalk(
          playerPos,
          enemyPos,
          speed,
          absoluteDistance,
          distanceToStalk
        );
      } else {
        targetVelocityObj = wander(positionToWander, enemyPos, speed);
      }

      const currentVelocity = enemyRef.current.linvel();
      const targetVelocity = new Vector3(
        targetVelocityObj.x,
        targetVelocityObj.y,
        targetVelocityObj.z
      );
      const smoothingFactor = 0.1;

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

    if (meshRef.current) {
      localTime.current += delta;
      meshRef.current.rotation.y = localTime.current * 0.6;
    }
  });

  useEffect(() => {
    if (enemyRef.current) {
      const interval = setInterval(() => {
        const enemyPos = enemyRef.current.translation();

        if (time % 3 === 0) {
          setPositionToWander({
            x:
              enemyPos.x +
              (Math.random() * distanceToWander - distanceToWander / 2),
            z:
              enemyPos.z +
              (Math.random() * distanceToWander - distanceToWander / 2),
          });
        }

        setTime((time) => time + 1);
      }, Math.random() * 1000);

      return () => clearInterval(interval);
    }
  }, [time]);

  useEffect(() => {
    if (showIndicator) return;

    const initialDelay = Math.random() * 500;
    let shootingInterval;
    const timeout = setTimeout(() => {
      shootingInterval = setInterval(() => {
        if (shootAudioRef.current) {
          const soundClone = shootAudioRef.current.cloneNode();
          soundClone.volume = 0.2;

          soundClone.play();
        }

        if (playerRef.current && enemyRef.current) {
          const playerPos = playerRef.current.translation();
          const enemyPos = enemyRef.current.translation();
          const bulletSpeed = 15;
          const direction = new Vector3(
            playerPos.x - enemyPos.x,
            0,
            playerPos.z - enemyPos.z
          ).normalize();
          const velocity = {
            x: direction.x * bulletSpeed,
            y: 0,
            z: direction.z * bulletSpeed,
          };

          setEnemyBullets((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              position: [enemyPos.x, enemyPos.y, enemyPos.z],
              velocity,
            },
          ]);
        }
      }, 2000);
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (shootingInterval) clearInterval(shootingInterval);
    };
  }, [playerRef, enemyRef, setEnemyBullets, showIndicator]);

  const visualRef = useRef(null);
  const { scene: enemySwordBody } = useGLTF(
    "/assets/models/enemySwordBody.glb"
  );
  const { scene: enemySwordHead } = useGLTF(
    "/assets/models/enemyPistolHead.glb"
  );
  const { scene: sword } = useGLTF("/assets/models/knightGun.glb");
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
              scale={0.55}
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
