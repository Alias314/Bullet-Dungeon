import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import {
  follow,
  stalk,
  runAway,
  wander,
  dash,
} from "../../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import {
  radialShoot,
  pistolShoot,
  shotgunShoot,
  radialMachineGun,
  radialBarrageShoot,
} from "../../Logic/EnemyShootingBehavior";
import { delay } from "../../../Utils/helper";

export default function Overseer({ id, playerRef, position, setEnemyBullets }) {
  const enemyRef = useRef();
  const speed = 1;
  const bossStates = ["follow", "barrage"];
  const [bossState, setBossState] = useState(bossStates[0]);

  useFrame(() => {
    if (playerRef.current && enemyRef.current) {
      const playerPos = playerRef.current.translation();
      const enemyPos = enemyRef.current.translation();
      const absoluteDistance = [
        Math.abs(playerPos.x - enemyPos.x),
        0,
        Math.abs(playerPos.z - enemyPos.z),
      ];
      const distanceToStalk = 7;
      let targetVelocityObj;

      if (bossState === "follow") {
        targetVelocityObj = follow(playerPos, enemyPos, speed);
      } else if (bossState === "barrage") {
        targetVelocityObj = { x: 0, y: 0, z: 0 };
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
    }
  });

  const barrageAttack = async (enemyPos) => {
    await delay(1000);
    await radialBarrageShoot(enemyPos, setEnemyBullets, 10, 12, 40);
    await delay(300);
    radialShoot(enemyPos, setEnemyBullets, 10, 64);
  };

  const followAttack = async (playerPos, enemyPos) => {
    await shotgunShoot(playerPos, enemyPos, 10, 5, setEnemyBullets);
    await delay(1000);
    await radialShoot(enemyPos, setEnemyBullets, 10, 32);
  };

  useEffect(() => {
    if (bossState === "barrage") {
      const enemyPos = enemyRef.current.translation();
      barrageAttack(enemyPos);
    } else if (bossState === "follow") {
      const interval = setInterval(() => {
        const playerPos = playerRef.current.translation();
        const enemyPos = enemyRef.current.translation();
        followAttack(playerPos, enemyPos);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [playerRef, enemyRef, bossState, setEnemyBullets]);

  useEffect(() => {
    const toggleBossState = () => {
      setBossState((prevState) =>
        prevState === "follow" ? "barrage" : "follow"
      );
    };
    const interval = setInterval(toggleBossState, 11000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RigidBody
        ref={enemyRef}
        name="Overseer"
        position={position}
        colliders="cuboid"
        type="dynamic"
        gravityScale={0}
        collisionGroups={interactionGroups(1, [0, 1, 2, 4])}
        lockRotations
      >
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>
    </>
  );
}
