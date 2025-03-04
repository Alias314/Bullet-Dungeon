import { useState, useEffect, useRef } from "react";
import { Vector2, Vector3 } from "three";

export default function useGameLogic(playerRef, selectedWeapon) {
  const [mouse, setMouse] = useState(new Vector2());
  const [playerBullets, setPlayerBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [playerDirection, setPlayerDirection] = useState(null);
  const [amountEnemy, setAmountEnemy] = useState(10);
  const [enemies, setEnemies] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(50);
  const [dashBar, setDashBar] = useState(2);
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);

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

  // shooting and stuff
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
        shootingInterval = setInterval(fireBullet, weaponShootingInterval);
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
  }, [selectedWeapon, playerRef]);

  // remove bullets
  const handleRemoveBullet = (bulletId) => {
    setPlayerBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
    setEnemyBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
  };

  // remove enemy
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

  // bullet collision
  const handleBulletCollision = (manifold, target, other, bulletId) => {
    if (other.rigidBodyObject.name.startsWith("Enemy-")) {
      const enemyId = parseInt(other.rigidBodyObject.name.split("-")[1]);
      handleRemoveEnemy(enemyId);
    } else if (other.rigidBodyObject.name === "Player") {
      setPlayerHealth((prev) => prev - 10);
      setShowDamageOverlay(true);
    }
    handleRemoveBullet(bulletId);
  };

  // melee enemy collision
  const handleMeleeEnemyCollision = (manifold, target, other) => {
    if (other.rigidBodyObject.name === "Player") {
      setPlayerHealth((prev) => prev - 1);
      setShowDamageOverlay(true);
    }
  };

  return {
    mouse,
    playerBullets,
    enemyBullets,
    setPlayerBullets,
    setEnemyBullets,
    playerDirection,
    setPlayerDirection,
    amountEnemy,
    setAmountEnemy,
    enemies,
    setEnemies,
    playerHealth,
    setPlayerHealth,
    dashBar,
    setDashBar,
    showDamageOverlay,
    setShowDamageOverlay,
    handleBulletCollision,
    handleMeleeEnemyCollision,
  };
}
