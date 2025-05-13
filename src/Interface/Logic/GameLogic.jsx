import { useState, useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";
import { generateLayout } from "../../Environment/GenerateLayout";
import { usePlayerStore } from "./usePlayerStore";
import { usePoolStore } from "./usePoolStore";
import { playerSingleShoot, playerSpreadShoot } from "./ShootingBehavior";
import HitParticles from "../../Characters/HitParticles";
import { color } from "framer-motion";
import { usePowerUpStore } from "./usePowerUpStore";
import { useGameStore } from "./useGameStore";

export default function useGameLogic(playerRef, triggerCameraShake) {
  // player
  const playerHealth = usePlayerStore((state) => state.stats.health);
  const stats = usePlayerStore((state) => state.stats);

  const setPlayerRef = usePlayerStore((state) => state.setPlayerRef);

  useEffect(() => {
    setPlayerRef(playerRef);
  }, [playerRef, setPlayerRef]);

  const [playerDirection, setPlayerDirection] = useState(null);
  const [mouse, setMouse] = useState(new Vector2());
  const isDamaged = useGameStore((state) => state.isDamaged);
  const setIsDamaged = useGameStore((state) => state.setIsDamaged);
  const isShoot = useRef(false);

  // Weapon cooldown configuration
  const weaponConfig = {
    pistol: { interval: 350, damage: 10 },
    shotgun: { interval: 1000, damage: 10 },
    machineGun: { interval: 80, damage: 3 },
  };
  const [currentWeapon, setCurrentWeapon] = useState("pistol");
  const canShoot = useRef(true);
  const isMouseDownRef = useRef(false);

  // enemy
  const [enemies, setEnemies] = useState([]);
  const [amountEnemy, setAmountEnemy] = useState(0);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [bosses, setBosses] = useState(null);
  const shootingIntervalRef = useRef(null);
  const hasBeatBoss = useRef(false);

  // Global State
  const getAvailablePlayerBullet = usePoolStore(
    (state) => state.getAvailablePlayerBullet
  );
  const activatePlayerBullet = usePoolStore(
    (state) => state.activatePlayerBullet
  );
  const initializeBulletPool = usePoolStore(
    (state) => state.initializeBulletPool
  );
  const deactivatePlayerBullet = usePoolStore(
    (state) => state.deactivatePlayerBullet
  );

  // level
  const level = useRef(1);
  const [layout, setLayout] = useState(() => generateLayout(level.current));
  const isGameRunning = useRef(true);
  const gameResetKey = useRef(0);

  // sound effects
  const shootAudioRef = useRef();
  useEffect(() => {
    shootAudioRef.current = new Audio(
      "assets/audio/Retro_Gun_SingleShot_04.wav"
    );
  }, []);

  const playerDirectionRef = useRef(playerDirection);
  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  // damage overlay
  useEffect(() => {
    if (isDamaged) {
      const timeout = setTimeout(() => {
        setIsDamaged(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isDamaged]);

  useEffect(() => {
    initializeBulletPool(200, 200);
  }, []);

  // player shooting
  useEffect(() => {
    if (isGameRunning.current) {
      const handlePointerMove = (e) => {
        setMouse(
          new Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
          )
        );
      };

      // spawn bullets based on selected weapon
      const fireBullet = () => {
        if (!canShoot.current || !playerRef.current) {
          return;
        }

        if (triggerCameraShake) {
          triggerCameraShake();
        }

        if (shootAudioRef.current) {
          const soundClone = shootAudioRef.current.cloneNode();
          soundClone.play();
        }

        const bulletSpeed = 40;
        const playerPos = playerRef.current.translation();
        const position = [playerPos.x, 1, playerPos.z];
        const velocity = {
          x: playerDirectionRef.current.x * bulletSpeed,
          y: 0,
          z: playerDirectionRef.current.z * bulletSpeed,
        };

        if (currentWeapon === "pistol") {
          playerSingleShoot(
            position,
            velocity,
            getAvailablePlayerBullet,
            activatePlayerBullet
          );
        } else if (currentWeapon === "shotgun") {
          const amountBullets = 5;
          playerSpreadShoot(
            amountBullets,
            position,
            bulletSpeed,
            playerDirectionRef,
            getAvailablePlayerBullet,
            activatePlayerBullet
          );
        } else if (currentWeapon === "machineGun") {
          playerSingleShoot(
            position,
            velocity,
            getAvailablePlayerBullet,
            activatePlayerBullet
          );
        }

        isShoot.current = true;
        canShoot.current = false;
        setTimeout(() => {
          canShoot.current = true;
          if (isMouseDownRef.current) fireBullet();
        }, weaponConfig[currentWeapon].interval);
      };

      // hold mouse button to shoot
      const handlePointerDown = () => {
        if (!playerRef.current || !isGameRunning.current) return;
        isMouseDownRef.current = true;
        fireBullet();
      };

      const handlePointerUp = () => {
        isMouseDownRef.current = false;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointerup", handlePointerUp);

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointerup", handlePointerUp);

        if (shootingIntervalRef.current) {
          clearInterval(shootingIntervalRef.current);
        }
      };
    }
  }, [currentWeapon, playerRef]);

  const deactivateEnemyBullet = usePoolStore(
    (state) => state.deactivateEnemyBullet
  );
  const removePlayerBullet = (bulletId) => {
    deactivatePlayerBullet(bulletId);
  };

  const removeEnemyBullet = (bulletId) => {
    deactivateEnemyBullet(bulletId);
  };

  // remove enemy
  const handleRemoveEnemy = (enemyId) => {
    setEnemies((prev) => {
      const newEnemies = prev
        .map((enemy) => {
          if (enemy.id === enemyId) {
            const newHealth = enemy.health - weaponConfig[currentWeapon].damage;
            return newHealth <= 0 ? null : { ...enemy, health: newHealth };
          }
          return enemy;
        })
        .filter((enemy) => enemy !== null);
      setAmountEnemy(newEnemies.length);
      return newEnemies;
    });
  };

  const removeHitParticles = () => {
    setHitParticles((prev) => prev.slice(1));
  };

  const increaseStat = usePlayerStore((state) => state.increaseStat);
  const [hitParticles, setHitParticles] = useState([]);
  const handlePlayerBulletCollision = (
    manifold,
    target,
    other,
    bulletId,
    bulletRef
  ) => {
    const bulletPos = bulletRef.current.translation();
    const position = [bulletPos.x, bulletPos.y, bulletPos.z];

    if (other.rigidBodyObject.name.startsWith("Enemy-")) {
      const enemyId = parseInt(other.rigidBodyObject.name.split("-")[1]);
      handleRemoveEnemy(enemyId);
      setHitParticles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: position,
          color: "red",
          removeHitParticles: removeHitParticles,
        },
      ]);
    } else if (other.rigidBodyObject.name === "Overseer") {
      setBosses((prev) => {
        if (!prev) return null;
        const newHealth = prev.health - weaponConfig[currentWeapon].damage;

        if (newHealth <= 0) {
          hasBeatBoss.current = true;
          isGameRunning.current = false;
          return null;
        }

        return { ...prev, health: newHealth };
      });
      setHitParticles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: position,
          color: "red",
          removeHitParticles: removeHitParticles,
        },
      ]);
    } else {
      setHitParticles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: position,
          color: "orange",
          removeHitParticles: removeHitParticles,
        },
      ]);
    }

    removePlayerBullet(bulletId);
  };

  const setIsInvincible = usePlayerStore((state) => state.setIsInvincible);

  const handleEnemyBulletCollision = (manifold, target, other, bulletId) => {
    const isInvincible = usePlayerStore.getState().isInvincible;
    if (
      other.rigidBodyObject.name === "Player" &&
      !isInvincible &&
      stats.health >= 1
    ) {
      increaseStat("health", -1);
      setIsDamaged(true);
      setIsInvincible(true);
      setTimeout(() => setIsInvincible(false), 1000);
      console.log(isInvincible);
    }

    removeEnemyBullet(bulletId);
  };

  // melee enemy collision
  const handleMeleeEnemyCollision = (manifold, target, other) => {
    const isInvincible = usePlayerStore.getState().isInvincible;
    if (
      other.rigidBodyObject.name === "Player" &&
      !isInvincible &&
      stats.health >= 1
    ) {
      increaseStat("health", -1);
      setIsDamaged(true);
      setIsInvincible(true);
      setTimeout(() => setIsInvincible(false), 1000);
    }
  };

  useEffect(() => {
    if (playerHealth === 0) {
      isGameRunning.current = false;
    }
  }, [playerHealth]);

  const resetStats = usePlayerStore((state) => state.resetStats);
  const resetPowerUps = usePowerUpStore((state) => state.resetPowerUps);
  const handlePlayAgain = () => {
    resetStats();
    level.current = 1;
    setLayout(generateLayout(level.current));
    hasBeatBoss.current = false;
    playerRef.current.setTranslation(new Vector3(0, 1, 0), true);
    setEnemies([]);
    setAmountEnemy(0);
    setEnemyBullets([]);
    setBosses(null);
    setCurrentWeapon("pistol");
    isGameRunning.current = true;
    gameResetKey.current++;
    resetPowerUps();
  };

  return {
    mouse,
    enemyBullets,
    setEnemyBullets,
    setPlayerDirection,
    amountEnemy,
    setAmountEnemy,
    enemies,
    setEnemies,
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
    setHitParticles,
  };
}
