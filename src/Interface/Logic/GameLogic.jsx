import { useState, useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";
import useSound from "use-sound";
import shootSound from "/assets/audio/Retro_Gun_SingleShot_04.wav";
import { generateLayout } from "../../Environment/GenerateLayout";

export default function useGameLogic(playerRef, triggerCameraShake) {
  // player
  const initialHealth = 10;
  const initialDashCooldown = 1000;
  const initialMaxDashBar = 2;
  const [playerHealth, setPlayerHealth] = useState(initialHealth);
  const [playerBullets, setPlayerBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState(null);
  const [mouse, setMouse] = useState(new Vector2());
  const [dashBar, setDashBar] = useState(2);
  const dashCooldown = useRef(initialDashCooldown);
  const maxDashBar = useRef(initialMaxDashBar);
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);
  const isShoot = useRef(false);

  // Weapon cooldown configuration
  const weaponConfig = {
    pistol: { interval: 350, damage: 10, auto: true },
    shotgun: { interval: 1000, damage: 20, auto: true },
    machineGun: { interval: 80, damage: 6, auto: true },
  };
  const [currentWeapon, setCurrentWeapon] = useState("pistol");
  const currentWeaponFireRate = weaponConfig[currentWeapon];
  const canShoot = useRef(true);
  const isMouseDownRef = useRef(false);

  // enemy
  const [enemies, setEnemies] = useState([]);
  const [amountEnemy, setAmountEnemy] = useState(0);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [bosses, setBosses] = useState(null);
  const shootingIntervalRef = useRef(null);
  const hasBeatBoss = useRef(false);

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

  // invincibility frame
  const [isInvincible, setIsInvincible] = useState(false);
  const isInvincibleRef = useRef(isInvincible);
  useEffect(() => {
    isInvincibleRef.current = isInvincible;
  }, [isInvincible]);

  const playerDirectionRef = useRef(playerDirection);
  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  // damage overlay
  useEffect(() => {
    if (showDamageOverlay) {
      const timeout = setTimeout(() => {
        setShowDamageOverlay(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showDamageOverlay]);

  // player shooting
  useEffect(() => {
    if (isGameRunning.current) {
      // calculate mouse position
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
        const amountPellet = 5;
        const spreadAngle = 1;

        if (currentWeapon === "pistol") {
          const bulletSpawnPosition = [playerPos.x, 1, playerPos.z];
          const velocity = {
            x: playerDirectionRef.current.x * bulletSpeed,
            y: 0,
            z: playerDirectionRef.current.z * bulletSpeed,
          };
          setPlayerBullets((prev) => [
            ...prev,
            { id: Math.random(), position: bulletSpawnPosition, velocity },
          ]);
        } else if (currentWeapon === "shotgun") {
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
              velocity,
            });
          }
          setPlayerBullets((prev) => [...prev, ...pellets]);
        } else if (currentWeapon === "machineGun") {
          const bulletSpawnPosition = [playerPos.x, 1, playerPos.z];
          const velocity = {
            x: playerDirectionRef.current.x * bulletSpeed,
            y: 0,
            z: playerDirectionRef.current.z * bulletSpeed,
          };
          setPlayerBullets((prev) => [
            ...prev,
            { id: Math.random(), position: bulletSpawnPosition, velocity },
          ]);
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

  // remove bullets
  const handleRemoveBullet = (bulletId) => {
    setPlayerBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
    setEnemyBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
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

  // bullet collision
  const handleBulletCollision = (manifold, target, other, bulletId) => {
    if (other.rigidBodyObject.name.startsWith("Enemy-")) {
      const enemyId = parseInt(other.rigidBodyObject.name.split("-")[1]);
      handleRemoveEnemy(enemyId);
    } else if (other.rigidBodyObject.name === "Player") {
      if (!isInvincibleRef.current && playerHealth >= 1) {
        setPlayerHealth((prev) => prev - 1);
        setShowDamageOverlay(true);
        setIsInvincible(true);
        setTimeout(() => setIsInvincible(false), 1000);
      }
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
    }
    handleRemoveBullet(bulletId);
  };

  // melee enemy collision
  const handleMeleeEnemyCollision = (manifold, target, other) => {
    if (other.rigidBodyObject.name === "Player") {
      // reset invincibility frame after 1 second
      if (!isInvincibleRef.current) {
        setPlayerHealth((prev) => prev - 1);
        setShowDamageOverlay(true);
        setIsInvincible(true);
        setTimeout(() => setIsInvincible(false), 1000);
      }
    }
  };

  useEffect(() => {
    if (playerHealth === 0) {
      isGameRunning.current = false;
    }
  }, [playerHealth]);

  const handlePlayAgain = () => {
    setPlayerHealth(initialHealth);
    dashCooldown.current = initialDashCooldown;
    maxDashBar.current = initialMaxDashBar;
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
  };

  return {
    mouse,
    playerBullets,
    setPlayerBullets,
    enemyBullets,
    setEnemyBullets,
    setPlayerDirection,
    amountEnemy,
    setAmountEnemy,
    enemies,
    setEnemies,
    playerHealth,
    dashBar,
    dashCooldown,
    maxDashBar,
    setDashBar,
    showDamageOverlay,
    handleBulletCollision,
    handleMeleeEnemyCollision,
    bosses,
    setBosses,
    isInvincible,
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
  };
}
