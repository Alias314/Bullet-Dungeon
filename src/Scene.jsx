import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { EmptyRoom } from "./RoomLayout";
import { Vector2 } from "three";
import Player from "./Player";
import { MeleeEnemy, PistolEnemy } from "./Enemy";
import React from 'react';
import { PlayerBullet, EnemyBullet } from "./Bullet";
import { Hallway } from "./Hallway";

function CameraController({ playerRef }) {
    useFrame(({ camera }) => {
        if (playerRef.current) {
            const playerPos = playerRef.current.translation();

            camera.position.x = playerPos.x;
            camera.position.z = playerPos.z + 10;
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
}

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
                type: (Math.random() < 0.5) ? 'melee' : 'pistol',
                position: getRandomPosition(),
            });
        }
        
        return enemyList;
    });
    const playerRef = useRef();
    
    const handleRemoveBullet = (bulletId) => {
        setPlayerBullets((prev) => prev.filter(bullet => bullet.id !== bulletId));
        setEnemyBullets((prev) => prev.filter(bullet => bullet.id !== bulletId));
    };
    
    const handleRemoveEnemy = (enemyId) => {
        if (amountEnemy > 0) {
            setAmountEnemy(prev => prev - 1);
        }
        
        setEnemies((prev) => prev.filter(enemy => enemy.id !== enemyId));
    };

    const handleBulletCollision = (manifold, target, other, bulletId) => {
        if (other.rigidBodyObject &&
            other.rigidBodyObject.name &&
            other.rigidBodyObject.name.startsWith('Enemy-')
        ) {
            const enemyId = parseInt(other.rigidBodyObject.name.split('-')[1]);
            console.log(enemyId);
            handleRemoveEnemy(enemyId);
        }

        handleRemoveBullet(bulletId);
    }

    useEffect(() => {
        const handlePointerMove = (e) => {
            setMouse(
                new Vector2(
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                )
            );
        };

        const handlePointerClick = () => {
            if (playerRef.current && playerDirection) {
                const bulletSpeed = 40;
                const playerPos = playerRef.current.translation();
                const bulletSpawnPosition = [
                    playerPos.x,
                    1,
                    playerPos.z,
                ];
                const velocity = {
                    x: playerDirection.x * bulletSpeed,
                    y: 0,
                    z: playerDirection.z * bulletSpeed,
                }

                setPlayerBullets((prevBullets) => [
                    ...prevBullets,
                    {
                        id: Math.random(),
                        position: bulletSpawnPosition,
                        velocity: velocity
                    }
                ]);
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerdown', handlePointerClick);
        
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerdown', handlePointerClick)
        };
    }, [playerBullets, playerDirection]);

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 15, 10] }}>
                <ambientLight />
                <directionalLight />
                <gridHelper args={[1000, 1000]} />
                
                <Suspense>
                    <Physics
                        interpolate={false} 
                        colliders={false}
                    >
                        <CameraController playerRef={playerRef} />
                        <Player 
                            playerRef={playerRef}
                            mouse={mouse}
                            setPlayerDirection={setPlayerDirection}
                        />

                        {enemies.map(enemy => (
                            enemy.type === 'pistol' ? (
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
                        ))}
                        
                        {playerBullets.map((bullet) => (
                            <PlayerBullet 
                                key={bullet.id}
                                id={bullet.id}
                                size={[0.3, 6, 6]}
                                position={bullet.position}
                                velocity={bullet.velocity}
                                handleBulletCollision={handleBulletCollision}
                            />
                        ))};

                        {enemyBullets.map((bullet) => (
                            <EnemyBullet 
                                key={bullet.id}
                                id={bullet.id}
                                size={[0.3, 6, 6]}
                                position={bullet.position}
                                velocity={bullet.velocity}
                                handleBulletCollision={handleBulletCollision}
                            />
                        ))};

                        <EmptyRoom
                            position={[0, 0, 0]} 
                            amountEnemy={amountEnemy} 
                        />
                        <Hallway 
                            position={[16.5, 0, 0.5]}
                        />
                    </Physics>
                </Suspense>
            </Canvas>
        </div>
    );
}