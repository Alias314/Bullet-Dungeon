import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { follow } from "../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import { radialShoot } from "../Logic/EnemyShootingBehavior";
import { time } from "three/tsl";

export default function MeleeEnemy({
  id,
  playerRef,
  position,
  setEnemyBullets,
  showIndicator,
}) {
  const enemyRef = useRef();
  const visualRef = useRef();
  const speed = 0;
  const smoothingFactor = 0.1;
  const localTime = useRef(0);
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      localTime.current += delta * 0.5;
      meshRef.current.rotation.z = localTime.current;
    }
  });

  useEffect(() => {
    const initialDelay = Math.random() * 3000;
    const intervalRef = { current: null };
    const timeout = setTimeout(() => {
      if (enemyRef.current?.isValid()) {
        intervalRef.current = setInterval(() => {
          if (enemyRef.current?.isValid()) {
            const enemyPos = enemyRef.current.translation();
            radialShoot(enemyPos, setEnemyBullets, 10, 8);
          }
        }, 3000);
      }
    }, initialDelay);
  
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  

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
        <mesh castShadow rotation={[1.6, 0, 0]}>
          {showIndicator ? (
            <>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="red" transparent opacity={0.4} />
            </>
          ) : (
            <mesh ref={meshRef}>
              <mesh>
                <torusGeometry args={[1, 0.5, 4, 8]} />
                <meshStandardMaterial color="#69ba27" />
              </mesh>
              <mesh>
                <torusGeometry args={[1, 0.5, 4, 8]} />
                <meshStandardMaterial color="white" wireframe />
              </mesh>
            </mesh>
          )}
        </mesh>
      </group>
    </RigidBody>
  );
}
