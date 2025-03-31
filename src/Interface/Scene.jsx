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
import ChestRoom from "../Environment/Rooms/ChestRoom";
import Overseer from "../Characters/Enemies/Bosses/Overseer";

import gameplayMusic from "../Assets/Audio/gameplayMusic.mp3";

export default function Scene() {
  const playerRef = useRef();
  const [selectedWeapon, setSelectedWeapon] = useState("pistol");
  const [layout] = useState(() => generateLayout());
  const audioRef = useRef(null);



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
    isInvincible,
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  return (
    <div className="w-screen h-screen relative bg-gray-900">
      <Canvas camera={{ position: [0, 14, 6] }} shadows>
        <ambientLight intensity={1} />
        <directionalLight
          position={[20, 20, -20]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Suspense>
          <Physics interpolate={false} colliders={false}>
            <CameraController playerRef={playerRef} mouse={mouse} />
            <Player
              playerRef={playerRef}
              mouse={mouse}
              setPlayerDirection={setPlayerDirection}
              dashBar={dashBar}
              setDashBar={setDashBar}
              isInvincible={isInvincible}
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
                      showIndicator={enemy.showIndicator}
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
                      showIndicator={enemy.showIndicator}
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
                      showIndicator={enemy.showIndicator}
                    />
                  );
                }
              })}
            {bosses && (
              <Overseer
                key={0}
                id={0}
                playerRef={playerRef}
                position={bosses.position}
                setEnemyBullets={setEnemyBullets}
              />
            )}
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
              setBosses={setBosses}
            />
            {/* <OverseerBossRoom
              position={[0, 0, 0]}
              playerRef={playerRef}
              openings={{ top: true, bottom: true, left: true, right: true }}
              setBosses={setBosses}
            /> */}
            {/* <ChestRoom position={[0, 0, 0]} playerRef={playerRef} /> */}
            {/* <MediumRoomTemplate
              position={[0, 0, 0]}
              playerRef={playerRef}
              openings={{ top: true, bottom: true, left: true, right: true }}
              amountEnemy={amountEnemy}
              setAmountEnemy={setAmountEnemy}
              setEnemies={setEnemies}
            /> */}
            {/* <SmallRoomTemplate
              position={[0, 0, 0]}
              playerRef={playerRef}
              openings={{ top: true, bottom: true, left: true, right: true }}
              amountEnemy={amountEnemy}
              setAmountEnemy={setAmountEnemy}
              setEnemies={setEnemies}
            /> */}
            {/* <SquareRoomTemplate
              position={[0, 0, 0]}
              playerRef={playerRef}
              openings={{ top: true, bottom: true, left: true, right: true }}
              amountEnemy={amountEnemy}
              setAmountEnemy={setAmountEnemy}
              setEnemies={setEnemies}
            /> */}
          </Physics>
        </Suspense>
      </Canvas>
      <HealthBar health={playerHealth} />
      <DashBar dashBar={dashBar} />
      <BossHealthBar bosses={bosses} />
      <Minimap layout={layout} playerRef={playerRef} />
      {showDamageOverlay && <DamageOverlay />}
      <audio ref={audioRef} src={gameplayMusic} />
    </div>
  );
}
