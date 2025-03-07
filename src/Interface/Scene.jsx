import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Vector2, Vector3 } from "three";

// Characters
import Player from "../Characters/Player";
import MeleeEnemy from "../Characters/Enemies/MeleeEnemy";
import PistolEnemy from "../Characters/Enemies/PistolEnemy";
import GatlingEnemy from "../Characters/Enemies/GatlingEnemy";
import * as B from "../Characters/Bullet";

// Interface
import { BossHealthBar, DashBar, HealthBar, Hotbar } from "./Inventory";
import GameOver from "./GameOver";
import LevelLayout from "../Environment/LevelLayout";
import Minimap from "./Minimap";
import DamageOverlay from "./DamageOverlay";
import { generateLayout } from "./Logic/GenerateLayout";
import { CameraController } from "./Logic/CameraController";

import useGameLogic from "./Logic/GameLogic";
import { CustomRoom } from "../Environment/RoomLayout";

// testing
import OverseerBossRoom from "../Environment/Rooms/OverseerBossRoom";
import Overseer from "../Characters/Enemies/Bosses/Overseer";
import { BokehPass } from "three/examples/jsm/Addons.js";

export default function Scene() {
  const playerRef = useRef();
  const [selectedWeapon, setSelectedWeapon] = useState("pistol");
  const [layout] = useState(() => generateLayout());

  const {
    mouse,
    playerBullets,
    enemyBullets,
    setEnemyBullets,
    setPlayerDirection,
    amountEnemy,
    setAmountEnemy,
    enemies,
    setEnemies,
    playerHealth,
    dashBar,
    setDashBar,
    showDamageOverlay,
    handleBulletCollision,
    handleMeleeEnemyCollision,
    bosses,
    setBosses,
  } = useGameLogic(playerRef, selectedWeapon);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "1") setSelectedWeapon("pistol");
      else if (e.key === "2") setSelectedWeapon("shotgun");
      else if (e.key === "3") setSelectedWeapon("minigun");
      else if (e.key === "4") setSelectedWeapon("railgun");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (playerHealth <= 0) return <GameOver />;

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
                      handleMeleeEnemyCollision={handleMeleeEnemyCollision}
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
            {/* <OverseerBossRoom
              position={[0, 0, 0]}
              playerRef={playerRef}
              setBosses={setBosses}
            />
            {bosses && (
              <Overseer
                key={0}
                id={0}
                playerRef={playerRef}
                position={[5, 2, 5]}
                setEnemyBullets={setEnemyBullets}
              />
            )} */}
          </Physics>
        </Suspense>
      </Canvas>
      <HealthBar health={playerHealth} />
      <DashBar dashBar={dashBar} />
      <BossHealthBar bosses={bosses} />
      {/* <Hotbar selectedWeapon={selectedWeapon} /> */}
      <Minimap layout={layout} />
      {showDamageOverlay && <DamageOverlay />}
    </div>
  );
}
