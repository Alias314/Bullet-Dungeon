import { useRef, useEffect } from "react";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePoolStore } from "../Interface/Logic/usePoolStore";
import HitParticles from "./HitParticles";

export function PlayerBullet({
  id,
  size,
  position,
  velocity,
  handlePlayerBulletCollision,
}) {
  const bulletRef = useRef();
  const visualRef = useRef();
  const lifetime = useRef(2);
  const isActive = usePoolStore((state) => state.playerBullets[id].active);
  const deactivatePlayerBullet = usePoolStore(
    (state) => state.deactivatePlayerBullet
  );

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
          lifetime.current = 2;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, deactivatePlayerBullet, id]);

  return (
    <>
      <RigidBody
        ref={bulletRef}
        name="playerBullet"
        colliders="ball"
        type="dynamic"
        gravityScale={0}
        position={position}
        collisionGroups={interactionGroups(2, [1, 4])}
        onCollisionEnter={({ manifold, target, other }) => {
          handlePlayerBulletCollision(manifold, target, other, id, bulletRef);
        }}
      >
        <mesh>
          <sphereGeometry args={size} />
          <meshStandardMaterial
            color="orange"
            emissive="red"
            emissiveIntensity={0.7}
          />
        </mesh>
      </RigidBody>
    </>
  );
}

export function EnemyBullet({
  id,
  size,
  position,
  velocity,
  handleEnemyBulletCollision,
}) {
  const bulletRef = useRef();
  const lifetime = useRef(2);
  const isActive = usePoolStore((state) => state.enemyBullets[id].active);
  const deactivateEnemyBullet = usePoolStore(
    (state) => state.deactivateEnemyBullet
  );

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
          deactivateEnemyBullet(id);
          lifetime.current = 2;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, deactivateEnemyBullet, id]);

  return (
    <RigidBody
      ref={bulletRef}
      name="enemyBullet"
      colliders="ball"
      type="dynamic"
      gravityScale={0}
      position={position}
      collisionGroups={interactionGroups(3, [0, 4])}
      onCollisionEnter={({ manifold, target, other }) => {
        handleEnemyBulletCollision(manifold, target, other, id);
      }}
    >
      <mesh>
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
