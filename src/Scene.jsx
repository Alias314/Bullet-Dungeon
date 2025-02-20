import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { emptyRoom, xObstacleRoom } from "./RoomLayout";
import { Vector2 } from "three";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Wall from "./Wall";
import Floor from "./Floor";
import Enemy from "./Enemy";
import React from 'react';
import Bullet from "./Bullet";
import { HealthBar, ManaBar } from "./Game";

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
    const roomArea = 100;
    const x = Math.random() * roomArea - roomArea / 2;
    const y = 1;
    const z = Math.random() * roomArea - roomArea / 2;

    return [x, y, z];
}

export default function Scene() {
    const [mouse, setMouse] = useState(new Vector2());
    const [enemyState, setEnemyState] = useState('stalk');
    const [bullets, setBullets] = useState([]);
    const [playerDirection, setPlayerDirection] = useState(null);
    const [enemies, setEnemies] = useState(() => {
        const enemyList = [];
        const amountEnemy = 100;

        for (let i = 0; i < amountEnemy; i++) {
            enemyList.push({
                id: i,
                position: getRandomPosition(),
            });
        }

        return enemyList;
    });
    const playerRef = useRef();
    const roomSize = 15;
    const amountEnemy = 100;
    let room = [<Floor key='floor' />];

    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if (xObstacleRoom[i][j] === 1) {
                room.push(
                    <Obstacle
                    key={`obstacle-${i}-${j}`}
                        position={[i - 5, 1, j - 5]} 
                        />
                )
            }
            else if (xObstacleRoom[i][j] === 2) {
                room.push(
                    <React.Fragment key={`wall-fragment-${i}-${j}`}>
                        <Wall 
                            position={[i - 5, 1, j - 5]}
                        />
                        <Wall 
                            position={[i - 5, 2, j - 5]}
                        />
                    </React.Fragment>
                )
            }
        }
    }
    
    const handleRemoveBullet = (bulletId) => {
        setBullets((prev) => prev.filter(bullet => bullet.id !== bulletId));
    };
    
    const handleRemoveEnemy = (enemyId) => {
        setEnemies((prev) => prev.filter(enemy => enemy.id !== enemyId));
    };

    const handleBulletCollision = (manifold, target, other, bulletId) => {
        if (other.rigidBodyObject &&
            other.rigidBodyObject.name &&
            other.rigidBodyObject.name.startsWith('Enemy-')
        ) {
            const enemyId = parseInt(other.rigidBodyObject.name.split('-')[1]);
            handleRemoveEnemy(enemyId);
        }

        handleRemoveBullet(bulletId);
    }

    const setEnemyRush = () => {
        setEnemyState('rush');
    }

    const setEnemyWander = () => {
        setEnemyState('wander');
    }

    const setEnemyStalk = () => {
        setEnemyState('stalk');
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
                    2,
                    playerPos.z,
                ];
                const velocity = {
                    x: playerDirection.x * bulletSpeed,
                    y: playerDirection.y * bulletSpeed,
                    z: playerDirection.z * bulletSpeed,
                }

                setBullets((prevBullets) => [
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
    }, [bullets, playerDirection]);

    return (
        <div className="w-full h-full relative">

            <Canvas camera={{ position: [0, 15, 10] }}>
                <ambientLight />
                <directionalLight />
                <gridHelper args={[100, 100]} />
                
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

                        {room}

                        {enemies.map(enemy => (
                            <Enemy 
                                key={enemy.id}
                                id={enemy.id}
                                playerRef={playerRef}
                                position={enemy.position}
                                enemyState={enemyState}
                            />
                        ))}
                        
                        {bullets.map((bullet) => (
                            <Bullet 
                                key={bullet.id}
                                id={bullet.id}
                                position={bullet.position}
                                velocity={bullet.velocity}
                                handleBulletCollision={handleBulletCollision}
                            />
                        ))};
                    </Physics>
                </Suspense>
            </Canvas>
            
            <div className="absolute left-[35%] flex bottom-4 gap-5">
                <button
                    className={`h-14 pl-4 pr-4 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer ${(enemyState === 'rush') ? 'bg-orange-600' : 'bg-orange-400'}`}
                    onClick={setEnemyRush}
                >
                    Rush
                </button>
                <button
                    className={`h-14 pl-4 pr-4 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer ${(enemyState === 'wander') ? 'bg-orange-600' : 'bg-orange-400'}`}
                    onClick={setEnemyWander}
                >
                    Wander
                </button>
                <button
                    className={`h-14 pl-4 pr-4 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer ${(enemyState === 'stalk') ? 'bg-orange-600' : 'bg-orange-400'}`}
                    onClick={setEnemyStalk}
                >
                    Stalk
                </button>
            </div>
        </div>
    );
}