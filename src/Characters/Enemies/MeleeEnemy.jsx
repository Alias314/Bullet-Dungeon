import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { follow } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { CuboidCollider } from "@react-three/rapier";
import gsap from "gsap";

export default function MeleeEnemy({
  id,
  playerRef,
  position,
  handleMeleeEnemyCollision,
  showIndicator,
}) {
  const enemyRef = useRef();
  const visualRef = useRef();
  const speed = 4;
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

  const { scene: enemySword } = useGLTF("/assets/models/enemySword.glb");
  const { scene: enemySwordBody } = useGLTF(
    "/assets/models/enemySwordBody.glb"
  );
  const { scene: enemySwordHead } = useGLTF(
    "/assets/models/enemySwordHead.glb"
  );
  const { scene: sword } = useGLTF("/assets/models/sword.glb");
  const modelEnemySword = useMemo(() => clone(enemySword), [enemySword]);
  const modelEnemySwordBody = useMemo(
    () => clone(enemySwordBody),
    [enemySwordBody]
  );
  const modelEnemySwordHead = useMemo(
    () => clone(enemySwordHead),
    [enemySwordHead]
  );
  const modelSword = useMemo(() => clone(sword), [sword]);
  const interval = useRef(null);
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
          x: swordRef.current.rotation.x - 0.5,
          duration: 0.6,
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
      colliders={false}
      type="dynamic"
      gravityScale={0}
      collisionGroups={
        showIndicator
          ? interactionGroups(0, [])
          : interactionGroups(1, [0, 1, 2, 4])
      }
      lockRotations
      onCollisionEnter={({ manifold, target, other }) => {
        if (!interval.current) {
          interval.current = setInterval(() => {
            handleMeleeEnemyCollision(manifold, target, other, id);
          }, 200);
        }
      }}
      onCollisionExit={() => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
        }
      }}
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
                scale={0.5}
                position={[0.575, 0, 0.3]}
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
