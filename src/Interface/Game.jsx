import { Suspense, useEffect, useRef, useState, React } from "react";
import { Vector2, Vector3 } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

// Characters
import Player from "../Characters/Player";
import { MeleeEnemy, PistolEnemy, GatlingEnemy } from "../Characters/Enemy";
import * as B from "../Characters/Bullet";

// Interfaces
import { DashBar, HealthBar, Hotbar } from "./Inventory";
import GameOver from "./GameOver";
import LevelLayout from "../Environment/LevelLayout";
import Minimap from "./Minimap";
import DamageOverlay from "./DamageOverlay";

function CameraController({ playerRef }) {
  useFrame(({ camera }) => {
    if (playerRef.current) {
      const playerPos = playerRef.current.translation();
      const targetPos = new Vector3(
        playerPos.x,
        camera.position.y,
        playerPos.z + 8
      );
      camera.position.lerp(targetPos, 0.1);
    }
  });

  return null;
}

function generateLayout() {
  let layout = [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
  ];
  const startingX = 3;
  const startingY = 3;
  const size = layout.length;
  const maxRooms = 7;
  let amountRooms = 1;

  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };

  const keys = Object.keys(directions);
  let currentX = startingX;
  let currentY = startingY;

  while (amountRooms <= maxRooms) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomDirection = directions[randomKey];
    currentX += randomDirection[0];
    currentY += randomDirection[1];

    if (
      currentX >= 0 &&
      currentX < size &&
      currentY >= 0 &&
      currentY < size &&
      layout[currentX][currentY] === -1
    ) {
      layout[currentX][currentY] = 1;
      amountRooms++;
    } else if (
      currentX < 0 ||
      currentX >= size ||
      currentY < 0 ||
      currentY >= size
    ) {
      currentX = startingX;
      currentY = startingY;
    }
  }

  return layout;
}

export default function Game() {
  const [mouse, setMouse] = useState(new Vector2());
  const [playerBullets, setPlayerBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState(null);
  const [amountEnemy, setAmountEnemy] = useState(10);
  const [enemies, setEnemies] = useState();
  const playerRef = useRef();
  const playerDirectionRef = useRef(playerDirection);
  const [playerHealth, setPlayerHealth] = useState(50);
  const [dashBar, setDashBar] = useState(2);
  const [selectedWeapon, setSelectedWeapon] = useState("pistol");
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);

  useEffect(() => {
    if (showDamageOverlay) {
      const timeout = setTimeout(() => {
        setShowDamageOverlay(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [showDamageOverlay]);
  const [layout] = useState(() => generateLayout());

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

    if (other.rigidBodyObject.name === "Player") {
      setPlayerHealth((prev) => prev - 10);
      setShowDamageOverlay(true);
    }

    handleRemoveBullet(bulletId);
  };

  useEffect(() => {
    let shootingInterval = null;
    clearInterval(shootingInterval);

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
      const amountPellet = 5;
      const spreadAngle = 1;

      if (selectedWeapon === "pistol") {
        const bulletSpawnPosition = [playerPos.x, 1, playerPos.z];
        const velocity = {
          x: playerDirectionRef.current.x * bulletSpeed,
          y: 0,
          z: playerDirectionRef.current.z * bulletSpeed,
        };

        setPlayerBullets((prevBullets) => [
          ...prevBullets,
          {
            id: Math.random(),
            position: bulletSpawnPosition,
            velocity: velocity,
          },
        ]);
      } else if (selectedWeapon === "shotgun") {
        const pellets = [];

        for (let i = 0; i < amountPellet; i++) {
          const angleOffset = (Math.random() - 0.5) * spreadAngle;
          const direction = new Vector3(
            playerDirectionRef.current.x,
            0,
            playerDirectionRef.current.z
          )
            .applyAxisAngle(new Vector3(0, 1, 0), angleOffset)
            .normalize();

          const velocity = {
            x: direction.x * bulletSpeed,
            y: 0,
            z: direction.z * bulletSpeed,
          };

          pellets.push({
            id: Math.random(),
            position: [playerPos.x, 1, playerPos.z],
            velocity: velocity,
          });
        }

        setPlayerBullets((prevBullets) => [...prevBullets, ...pellets]);
      } else if (selectedWeapon === "minigun") {
        const bulletSpawnPosition = [playerPos.x, 1, playerPos.z];
        const velocity = {
          x: playerDirectionRef.current.x * bulletSpeed,
          y: 0,
          z: playerDirectionRef.current.z * bulletSpeed,
        };

        setPlayerBullets((prevBullets) => [
          ...prevBullets,
          {
            id: Math.random(),
            position: bulletSpawnPosition,
            velocity: velocity,
          },
        ]);
      }
    };

    const handlePointerDown = () => {
      if (
        playerRef.current &&
        playerDirectionRef.current &&
        !shootingInterval
      ) {
        let weaponShootingInterval;

        if (selectedWeapon === "pistol") {
          weaponShootingInterval = 400;
        } else if (selectedWeapon === "shotgun") {
          weaponShootingInterval = 1200;
        } else if (selectedWeapon === "minigun") {
          weaponShootingInterval = 100;
        } else if (selectedWeapon === "railgun") {
          weaponShootingInterval = 2000;
        }

        fireBullet();
        shootingInterval = setInterval(() => {
          fireBullet();
        }, weaponShootingInterval);
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
  }, [selectedWeapon]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "1") {
        setSelectedWeapon("pistol");
      } else if (e.key === "2") {
        setSelectedWeapon("shotgun");
      } else if (e.key === "3") {
        setSelectedWeapon("minigun");
      } else if (e.key === "4") {
        setSelectedWeapon("railgun");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (playerHealth <= 0) {
    return (
      <div>
        <GameOver />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 13, 8] }} shadows>
        <ambientLight intensity={1} />
        <directionalLight
          position={[20, 20, -20]}
          intensity={1}
          castShadow
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Suspense>
          <Physics interpolate={false} colliders={false}>
            <CameraController playerRef={playerRef} />
            <Player
              playerRef={playerRef}
              mouse={mouse}
              setPlayerDirection={setPlayerDirection}
              dashBar={dashBar}
              setDashBar={setDashBar}
            />
            {enemies &&
              enemies.map((enemy) => {
                if (enemy.type === "pistol") {
                  return (
                    <PistolEnemy
                      key={enemy.id}
                      id={enemy.id}
                      playerRef={playerRef}
                      position={enemy.position}
                      setEnemyBullets={setEnemyBullets}
                    />
                  );
                } else if (enemy.type === "melee") {
                  return (
                    <MeleeEnemy
                      key={enemy.id}
                      id={enemy.id}
                      playerRef={playerRef}
                      position={enemy.position}
                    />
                  );
                } else if (enemy.type === "gatling") {
                  return (
                    <GatlingEnemy
                      key={enemy.id}
                      id={enemy.id}
                      playerRef={playerRef}
                      position={enemy.position}
                      setEnemyBullets={setEnemyBullets}
                    />
                  );
                }
              })}
            {playerBullets.map((bullet) => (
              <B.PlayerBullet
                key={bullet.id}
                id={bullet.id}
                size={[0.3, 6, 6]}
                position={bullet.position}
                velocity={bullet.velocity}
                handleBulletCollision={handleBulletCollision}
              />
            ))}
            {enemyBullets.map((bullet) => (
              <B.EnemyBullet
                key={bullet.id}
                id={bullet.id}
                size={[0.3, 6, 6]}
                position={bullet.position}
                velocity={bullet.velocity}
                handleBulletCollision={handleBulletCollision}
              />
            ))}
            <LevelLayout
              layout={layout}
              amountEnemy={amountEnemy}
              setAmountEnemy={setAmountEnemy}
              playerRef={playerRef}
              setEnemies={setEnemies}
            />
          </Physics>
        </Suspense>
      </Canvas>
      <HealthBar health={playerHealth} />
      <DashBar dashBar={dashBar} />
      <Hotbar selectedWeapon={selectedWeapon} />
      <Minimap layout={layout} />
      {showDamageOverlay && <DamageOverlay />}
    </div>
  );
}
