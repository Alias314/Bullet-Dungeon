import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RigidBody,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import {
  follow,
  stalk,
  runAway,
  wander,
  dash,
} from "../../Logic/EnemyMovementBehavior";
import { Vector3 } from "three";
import { delay } from "../../../Utils/Helper";
import { useGLTF } from "@react-three/drei";
import {
  enemyRadialShoot,
  enemySpreadShoot,
  radialBarrageShoot,
} from "../../../Interface/Logic/ShootingBehavior";
import { usePoolStore } from "../../../Interface/Logic/usePoolStore";

export default function Overseer({ id, playerRef, position, setEnemyBullets }) {
  const enemyRef = useRef();
  const speed = 2;
  const bossStates = ["follow", "barrage"];
  const [bossState, setBossState] = useState(bossStates[1]);
  const { scene } = useGLTF("/assets/models/boss.glb");
  const meshRef = useRef();
  const localTime = useRef(0);
  const shootAudioRef = useRef();

  useEffect(() => {
    shootAudioRef.current = new Audio(
      "assets/audio/Retro_Gun_SingleShot_04.wav"
    );
  }, []);

  useFrame((_, delta) => {
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

      if (meshRef.current) {
        localTime.current -= delta;

        meshRef.current.rotation.y = localTime.current;
      }
    }
  });

  const getAvailableEnemyBullet = usePoolStore(
    (state) => state.getAvailableEnemyBullet
  );
  const activateEnemyBullet = usePoolStore(
    (state) => state.activateEnemyBullet
  );
  const barrageAttack = async () => {
    const enemyPos = enemyRef.current.translation();
    const position = [enemyPos.x, 1, enemyPos.z];

    radialBarrageShoot(
      position,
      10,
      9,
      48,
      getAvailableEnemyBullet,
      activateEnemyBullet
    );
  };

  const followAttack = async () => {
    const playerPos = playerRef.current.translation();
    const enemyPos = enemyRef.current.translation();
    const position = [enemyPos.x, 1, enemyPos.z];

    enemySpreadShoot(
      playerPos,
      enemyPos,
      position,
      10,
      4,
      getAvailableEnemyBullet,
      activateEnemyBullet
    );
    enemyRadialShoot(
      position,
      10,
      8,
      getAvailableEnemyBullet,
      activateEnemyBullet
    );
  };

  useEffect(() => {
    if (bossState === "barrage") {
      barrageAttack();
    } else if (bossState === "follow") {
      const interval = setInterval(() => {
        followAttack();
      }, 900);

      return () => clearInterval(interval);
    }
  }, [playerRef, enemyRef, bossState, setEnemyBullets]);

  useEffect(() => {
    const toggleBossState = () => {
      setBossState((prevState) =>
        prevState === "follow" ? "barrage" : "follow"
      );
    };
    const interval = setInterval(toggleBossState, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RigidBody
        ref={enemyRef}
        name="Overseer"
        position={position}
        colliders={false}
        type="dynamic"
        gravityScale={0}
        collisionGroups={interactionGroups(1, [0, 1, 2, 4])}
        linearDamping={1}
        lockRotations
      >
        <primitive
          ref={meshRef}
          object={scene}
          position={[0, 0, 0]}
          scale={0.35}
        />
        <CuboidCollider args={[1.5, 1, 1.5]} />
      </RigidBody>
    </>
  );
}
