import { useState, useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";

export default function useGameLogic(playerRef, selectedWeapon) {
  // player
  const [playerHealth, setPlayerHealth] = useState(10000);
  const [playerBullets, setPlayerBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState(null);
  const [mouse, setMouse] = useState(new Vector2());
  const [dashBar, setDashBar] = useState(2);
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);

  // Weapon cooldown configuration
  const weaponConfig = {
    pistol: { interval: 400, auto: true },
    shotgun: { interval: 1200, auto: false },
    minigun: { interval: 100, auto: true },
    railgun: { interval: 2000, auto: false }
  };

  // enemy
  const [enemies, setEnemies] = useState([]);
  const [amountEnemy, setAmountEnemy] = useState(0);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [bosses, setBosses] = useState(null);
  const shootingIntervalRef = useRef(null);

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
    let shootingInterval = null;

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
      if (!playerRef.current || !playerDirectionRef.current) return;
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
        setPlayerBullets((prev) => [
          ...prev,
          { id: Math.random(), position: bulletSpawnPosition, velocity },
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
            velocity,
          });
        }
        setPlayerBullets((prev) => [...prev, ...pellets]);
      } else if (selectedWeapon === "minigun") {
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
    };

    // hold mouse button to shoot
    const handlePointerDown = () => {
      if (
        playerRef.current &&
        playerDirectionRef.current &&
        !shootingIntervalRef.current
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
        shootingIntervalRef.current = setInterval(fireBullet, weaponShootingInterval);
      }
    };

    const handlePointerUp = () => {
      if (shootingIntervalRef.current) {
        clearInterval(shootingIntervalRef.current);
        shootingIntervalRef.current = null;
      }
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
  }, [selectedWeapon, playerRef]);

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
            const newHealth = enemy.health - 10;
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
      if (!isInvincibleRef.current) {
        setPlayerHealth((prev) => prev - 1);
        setShowDamageOverlay(true);
        setIsInvincible(true);
        setTimeout(() => setIsInvincible(false), 1000);
      }
    } else if (other.rigidBodyObject.name === "Overseer") {
      setBosses((prev) => {
        if (!prev) return null;
        const newHealth = prev.health - 10;
        return newHealth <= 0 ? null : { ...prev, health: newHealth };
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

  return {
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
  };
}
