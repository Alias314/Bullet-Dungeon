import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { TorusGeometry, Vector2, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

// Characters
import Player from "../Characters/Player";
import MeleeEnemy from "../Characters/Enemies/MeleeEnemy";
import PistolEnemy from "../Characters/Enemies/PistolEnemy";
import GatlingEnemy from "../Characters/Enemies/GatlingEnemy";
import TorusEnemy from "../Characters/Enemies/MageEnemy";
import { PlayerBullet, EnemyBullet } from "../Characters/Bullet";

// Interface
import { BossHealthBar, DashBar, HealthBar, Hotbar } from "./Inventory";
import GameOver from "./GameOver";
import LevelLayout from "../Environment/LevelLayout";
import Minimap from "./Minimap";
import DamageOverlay from "./DamageOverlay";
import { CameraController } from "./Logic/CameraController";
import GameOverOverlay from "./GameOverOverlay";
import useGameLogic from "./Logic/GameLogic";

// testing
import Overseer from "../Characters/Enemies/Bosses/Overseer";

import gameplayMusic from "../Assets/Audio/gameplayMusic.mp3";
import SplashScreen from "./SplashScreen";
import RoomCLearOverlay from "./RoomClearOverlay";
import PowerUpOverlay from "./PowerUpOverlay";
import VictoryOverlay from "./VictoryOverlay";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Timer from "./Timer";
import { usePoolStore } from "./Logic/usePoolStore";
import UserInterface from "./UserInterface";
import { Ninja, RadialBullet } from "./Logic/powerUps";
import { usePlayerStore } from "./Logic/usePlayerStore";
import Shield from "../Characters/Shield";
import { usePowerUpStore } from "./Logic/usePowerUpStore";
import HitParticles from "../Characters/HitParticles";

export default function Scene() {
  const playerRef = useRef();
  const shakeRef = useRef(0);
  const [showRoomClear, setShowRoomClear] = useState(false);
  const [hasBeatLevel, setHasBeatLevel] = useState(false);
  const backgroundTransitionRef = useRef();

  const triggerCameraShake = () => {
    shakeRef.current = 0;
  };

  const {
    mouse,
    setPlayerDirection,
    amountEnemy,
    setAmountEnemy,
    enemies,
    setEnemies,
    dashBar,
    dashCooldown,
    maxDashBar,
    setDashBar,
    showDamageOverlay,
    handlePlayerBulletCollision,
    handleEnemyBulletCollision,
    handleMeleeEnemyCollision,
    bosses,
    setBosses,
    isShoot,
    hasBeatBoss,
    level,
    layout,
    setLayout,
    handlePlayAgain,
    isGameRunning,
    gameResetKey,
    currentWeapon,
    setCurrentWeapon,
    hitParticles,
  } = useGameLogic(playerRef, triggerCameraShake);

  useEffect(() => {
    const gameplayAudio = new Audio("assets/audio/Digestive_Biscuit.mp3");
    gameplayAudio.volume = 0;
    gameplayAudio.loop = true;
    gameplayAudio.play();
  }, []);

  useEffect(() => {
    if (showRoomClear) {
      setTimeout(() => {
        setShowRoomClear(false);
      }, 1000);
    }
  }, [showRoomClear]);

  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);
  useEffect(() => {
    setPlayerRef(playerRef);
  }, [playerRef.current]);

  // useGSAP(() => {
  //   const context = gsap.context(() => {
  //     const timeline = gsap.timeline();

  //     timeline.fromTo(
  //       ".intro-text",
  //       { opacity: 0, y: 20 },
  //       { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  //     );

  //     timeline.to(backgroundTransitionRef.current, {
  //       opacity: 0,
  //       duration: 1,
  //       ease: "power2.in",
  //       delay: 0.3,
  //     });
  //   }, backgroundTransitionRef);

  //   return () => context.revert();
  // }, []);

  const stats = usePlayerStore((state) => state.stats);
  const playerBullets = usePoolStore((state) => state.playerBullets);
  const enemyBullets = usePoolStore((state) => state.enemyBullets);
  const isDashing = usePlayerStore((state) => state.isDashing);
  const powerUps = usePowerUpStore((state) => state.powerUps);

  return (
    <div className="w-screen h-screen relative bg-gray-800">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 8, 8] }}
        shadows
      >
        <ambientLight intensity={1} />
        <directionalLight
          position={[20, 20, -20]}
          intensity={2}
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
            <CameraController
              playerRef={playerRef}
              mouse={mouse}
              shakeRef={shakeRef}
              isShoot={isShoot}
            />
            <Player
              playerRef={playerRef}
              mouse={mouse}
              setPlayerDirection={setPlayerDirection}
              dashBar={dashBar}
              setDashBar={setDashBar}
              isGameRunning={isGameRunning}
              currentWeapon={currentWeapon}
              isShoot={isShoot}
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
                      showIndicator={enemy.showIndicator}
                    />
                  );
                } else if (enemy.type === "mage") {
                  return (
                    <TorusEnemy
                      key={enemy.id}
                      id={enemy.id}
                      playerRef={playerRef}
                      position={enemy.position}
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
              />
            )}
            {playerBullets
              .filter((b) => b.active)
              .map((bullet) => (
                <PlayerBullet
                  key={bullet.id}
                  id={bullet.id}
                  size={[0.3, 6, 6]}
                  position={bullet.position}
                  velocity={bullet.velocity}
                  handlePlayerBulletCollision={handlePlayerBulletCollision}
                />
              ))}
            {enemyBullets
              .filter((b) => b.active)
              .map((bullet) => (
                <EnemyBullet
                  key={bullet.id}
                  id={bullet.id}
                  size={[0.3, 6, 6]}
                  position={bullet.position}
                  velocity={bullet.velocity}
                  handleEnemyBulletCollision={handleEnemyBulletCollision}
                />
              ))}
            <LevelLayout
              layout={layout}
              amountEnemy={amountEnemy}
              setAmountEnemy={setAmountEnemy}
              playerRef={playerRef}
              setEnemies={setEnemies}
              setBosses={setBosses}
              setShowRoomClear={setShowRoomClear}
              setLayout={setLayout}
              level={level}
              setHasBeatLevel={setHasBeatLevel}
              gameResetKey={gameResetKey}
              currentWeapon={currentWeapon}
              setCurrentWeapon={setCurrentWeapon}
              isShoot={isShoot}
            />
            {isDashing && powerUps["dashShield"] && <Shield />}
            <Ninja />
          </Physics>
        </Suspense>
        {hitParticles.map((p) => (
          <HitParticles
            key={p.id}
            position={p.position}
            color={p.color}
            removeHitParticles={p.removeHitParticles}
          />
        ))}
      </Canvas>

      <BossHealthBar bosses={bosses} />
      <UserInterface />
      <Minimap layout={layout} playerRef={playerRef} />

      {showDamageOverlay && <DamageOverlay />}
      {showRoomClear && <RoomCLearOverlay />}
      {hasBeatLevel && (
        <PowerUpOverlay
          displayPowerUpOverlay={setHasBeatLevel}
          setDashBar={setDashBar}
          dashCooldown={dashCooldown}
          maxDashBar={maxDashBar}
          playerRef={playerRef}
        />
      )}
      {hasBeatBoss.current && (
        <VictoryOverlay handlePlayAgain={handlePlayAgain} />
      )}
      {stats.health <= 0 && (
        <GameOverOverlay handlePlayAgain={handlePlayAgain} />
      )}
      <RadialBullet bulletSpeed={30} amountBullets={16} />
      <Timer />

      {/* <div
        ref={backgroundTransitionRef}
        className="w-full h-full inset-0 absolute flex items-center justify-center bg-black pointer-events-none opacity-100"
      >
        <h1 className="intro-text font-DePixelHalbfett text-5xl text-white font-semibold">
          Defeat the boss
        </h1>
      </div> */}
    </div>
  );
}
