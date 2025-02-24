import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { EmptyRoom } from "./RoomLayout";
import { Vector2, Vector3 } from "three";
import Player from "./Player";
import { MeleeEnemy, PistolEnemy } from "./Enemy";
import React from "react";
import { PlayerBullet, EnemyBullet } from "./Bullet";
import { Hallway } from "./Hallway";

function CameraController({ playerRef }) {
  useFrame(({ camera }) => {
    if (playerRef.current) {
      const playerPos = playerRef.current.translation();
      const targetPos = new Vector3(
        playerPos.x,
        camera.position.y,
        playerPos.z + 8
      );
      camera.position.lerp(targetPos, 0.2);
    }
  });

  return null;
}

const getRandomPosition = () => {
  const roomArea = 23;
  const x = Math.random() * roomArea - roomArea / 2;
  const y = 1;
  const z = Math.random() * roomArea - roomArea / 2;

  return [x, y, z];
};

export default function Scene() {
  const [mouse, setMouse] = useState(new Vector2());
  const [playerBullets, setPlayerBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState(null);
  const [amountEnemy, setAmountEnemy] = useState(6);
  const [enemies, setEnemies] = useState(() => {
    const enemyList = [];

    for (let i = 0; i < amountEnemy; i++) {
      enemyList.push({
        id: i,
        type: Math.random() < 0.5 ? "melee" : "pistol",
        health: 30,
        position: getRandomPosition(),
      });
    }

    return enemyList;
  });
  const playerRef = useRef();
  const playerDirectionRef = useRef(playerDirection);

  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  const handleRemoveBullet = (bulletId) => {
    setPlayerBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
    setEnemyBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
  };

  const handleRemoveEnemy = (enemyId) => {
    setEnemies((prev) =>
      prev
        .map((enemy) => {
          if (enemy.id === enemyId) {
            const newHealth = enemy.health - 10;

            if (newHealth <= 0) {
              setAmountEnemy((prev) => prev - 1);
              return null;
            }

            return { ...enemy, health: newHealth };
          }

          return enemy;
        })
        .filter((enemy) => enemy !== null)
    );
  };

  const handleBulletCollision = (manifold, target, other, bulletId) => {
    if (
      other.rigidBodyObject &&
      other.rigidBodyObject.name &&
      other.rigidBodyObject.name.startsWith("Enemy-")
    ) {
      const enemyId = parseInt(other.rigidBodyObject.name.split("-")[1]);
      handleRemoveEnemy(enemyId);
    }

    handleRemoveBullet(bulletId);
  };

  useEffect(() => {
    let shootingInterval = null;

    const handlePointerMove = (e) => {
      setMouse(
        new Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        )
      );
    };

    const fireBullet = () => {
      const bulletSpeed = 40;
      const playerPos = playerRef.current.translation();
      const bulletSpawnPosition = [playerPos.x, 1, playerPos.z];
      const velocity = {
        x: (playerDirectionRef.current.x + Math.random() / 10) * bulletSpeed,
        y: 0,
        z: (playerDirectionRef.current.z + Math.random() / 10) * bulletSpeed,
      };

      setPlayerBullets((prevBullets) => [
        ...prevBullets,
        {
          id: Math.random(),
          position: bulletSpawnPosition,
          velocity: velocity,
        },
      ]);
    };

    const handlePointerDown = () => {
      if (
        playerRef.current &&
        playerDirectionRef.current &&
        !shootingInterval
      ) {
        fireBullet();

        shootingInterval = setInterval(() => {
          fireBullet();
        }, 400);
      }
    };

    const handlePointerUp = () => {
      if (shootingInterval) {
        clearInterval(shootingInterval);
        shootingInterval = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 13, 8] }}>
        <ambientLight intensity={1} />
        <directionalLight intensity={1} castShadow />
        <gridHelper args={[100, 100]} />

        <Suspense>
          <Physics interpolate={false} colliders={false}>
            <CameraController playerRef={playerRef} />
            <Player
              playerRef={playerRef}
              mouse={mouse}
              setPlayerDirection={setPlayerDirection}
            />
            {enemies.map((enemy) =>
              enemy.type === "pistol" ? (
                <PistolEnemy
                  key={enemy.id}
                  id={enemy.id}
                  playerRef={playerRef}
                  position={enemy.position}
                  setEnemyBullets={setEnemyBullets}
                />
              ) : (
                <MeleeEnemy
                  key={enemy.id}
                  id={enemy.id}
                  playerRef={playerRef}
                  position={enemy.position}
                />
              )
            )}
            {playerBullets.map((bullet) => (
              <PlayerBullet
                key={bullet.id}
                id={bullet.id}
                size={[0.3, 6, 6]}
                position={bullet.position}
                velocity={bullet.velocity}
                handleBulletCollision={handleBulletCollision}
              />
            ))}
            ;
            {enemyBullets.map((bullet) => (
              <EnemyBullet
                key={bullet.id}
                id={bullet.id}
                size={[0.3, 6, 6]}
                position={bullet.position}
                velocity={bullet.velocity}
                handleBulletCollision={handleBulletCollision}
              />
            ))}
            ;
            <EmptyRoom position={[0, 0, 0]} amountEnemy={amountEnemy} />
            <Hallway position={[16.5, 0, 0.5]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
