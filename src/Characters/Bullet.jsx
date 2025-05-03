import { useRef, useEffect } from "react";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePoolStore } from "../Interface/Logic/usePoolStore";

export function PlayerBullet({
  id,
  size,
  position,
  velocity,
  handleBulletCollision,
}) {
  const bulletRef = useRef();
  const lifetime = useRef(2);
  const isActive = usePoolStore((state) => state.playerBullets[id].active);
  const deactivatePlayerBullet = usePoolStore((state) => state.deactivatePlayerBullet);

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.setLinvel(velocity, true);
    }
  }, [velocity]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        if (lifetime.current > 0) {
          lifetime.current--;
        } else {
          deactivatePlayerBullet(id);
          console.log(id);
          lifetime.current = 2;
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isActive, deactivatePlayerBullet, id]);

  return (
    <RigidBody
      ref={bulletRef}
      name="playerBullet"
      colliders="ball"
      type="dynamic"
      gravityScale={0}
      collisionGroups={interactionGroups(2, [1, 4])}
      onCollisionEnter={({ manifold, target, other }) => {
        handleBulletCollision(manifold, target, other, id);
      }}
    >
      <mesh position={position}>
        <sphereGeometry args={size} />
        <meshStandardMaterial
          color="orange"
          emissive="red"
          emissiveIntensity={0.7}
        />
      </mesh>
    </RigidBody>
  );
}

export function EnemyBullet({
  id,
  size,
  position,
  velocity,
  handleBulletCollision,
}) {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.setLinvel(velocity, true);
    }
  }, [velocity]);

  return (
    <RigidBody
      ref={bulletRef}
      name="enemyBullet"
      colliders="ball"
      type="dynamic"
      gravityScale={0}
      collisionGroups={interactionGroups(3, [0, 4])}
      onCollisionEnter={({ manifold, target, other }) => {
        handleBulletCollision(manifold, target, other, id);
      }}
    >
      <mesh position={position}>
        <sphereGeometry args={size} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.7}
        />
      </mesh>
    </RigidBody>
  );
}
