import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { radialShoot } from "../Logic/EnemyShootingBehavior";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { CuboidCollider } from "@react-three/rapier";
import { useState } from "react";
import { follow, stalk, runAway, wander } from "../Logic/EnemyMovementBehavior";


export default function MeleeEnemy({
  id,
  playerRef,
  position,
  setEnemyBullets,
  showIndicator,
}) {
  const enemyRef = useRef();
  const visualRef = useRef();
  const speed = 2;
  const smoothingFactor = 0.1;
  const localTime = useRef(0);
  const meshRef = useRef();
  const shootAudioRef = useRef();
  const distanceToWander = 100;
  const [positionToWander, setPositionToWander] = useState(null);
  const [time, setTime] = useState(0);

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
    const initialDelay = Math.random() * 500;
    const intervalRef = { current: null };
    const timeout = setTimeout(() => {
      if (enemyRef.current?.isValid()) {
        intervalRef.current = setInterval(() => {
          if (enemyRef.current?.isValid()) {
            const enemyPos = enemyRef.current.translation();
            radialShoot(enemyPos, setEnemyBullets, 10, 10, shootAudioRef);
          }
        }, 2000);
      }
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const { scene: enemySwordBody } = useGLTF(
    "/assets/models/enemyWizardBody.glb"
  );
  const { scene: enemySwordHead } = useGLTF(
    "/assets/models/enemyWizardHead.glb"
  );
  const { scene: sword } = useGLTF("/assets/models/staff.glb");
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

  useEffect(() => {
    if (swordRef.current) {
      gsap.fromTo(
        swordRef.current.rotation,
        { x: swordRef.current.rotation.x },
        {
          x: swordRef.current.rotation.x + 0.25,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        }
      );

      gsap.fromTo(
        swordRef.current.position,
        { y: swordRef.current.position.y },
        {
          y: swordRef.current.position.y + 0.25,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        }
      );
    }
  }, [swordRef.current]);

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
      <group ref={visualRef}>
        <mesh castShadow rotation={[0, 0, 0]}>
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
                position={[0.65, 0.4, 0]}
                dispose={null}
              />
            </>
          )}
        </mesh>
      </group>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}
