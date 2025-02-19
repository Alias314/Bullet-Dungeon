import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { emptyRoom, xObstacleRoom } from "./RoomLayout";
import { Vector2, Vector3 } from "three";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Wall from "./Wall";
import Floor from "./Floor";
import Enemy from "./Enemy";
import React from 'react';
import Bullet from "./Bullet";

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
    const [enemyState, setEnemyState] = useState('wander');
    const [bullets, setBullets] = useState([]);
    const [playerDirection, setPlayerDirection] = useState(null);
    const playerRef = useRef();
    const roomSize = 15;
    const amountEnemy = 100;
    let room = [<Floor key='floor' />];
    let enemySpawn = [];
    
    const [enemyPositions] = useState(() => {
        const positions = [];

        for (let i = 0; i < amountEnemy; i++) {
            positions.push(getRandomPosition());
        }

        return positions;
    });
    
    for (let i = 0; i < amountEnemy; i++) {
        enemySpawn.push(
            <Enemy
                key={i}
                playerRef={playerRef}
                position={enemyPositions[i]}
                enemyState={enemyState}
            />
        )
    }

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
                const bulletSpeed = 50;
                const playerPos = playerRef.current.translation();
                const bulletSpawnPosition = [
                    playerPos.x,
                    1.5,
                    playerPos.z,
                ];
                const velocity = {
                    x: playerDirection.x * bulletSpeed,
                    y: playerDirection.y * bulletSpeed,
                    z: playerDirection.z * bulletSpeed,
                }

                setBullets((prevBullets) => [
                    ...prevBullets,
                    <Bullet
                        key={Math.random()}
                        position={bulletSpawnPosition}
                        velocity={velocity}
                    />
                ]);

                console.log(bullets);
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
                        {enemySpawn}
                        {bullets}
                    </Physics>
                </Suspense>
            </Canvas>

            <div className="absolute left-[35%] flex bottom-4 gap-5">
                <button
                    className="h-14 pl-4 pr-4 bg-orange-400 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer"
                    onClick={setEnemyRush}
                >
                    Rush
                </button>
                <button
                    className="h-14 pl-4 pr-4 bg-orange-400 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer"
                    onClick={setEnemyWander}
                >
                    Wander
                </button>
                <button
                    className="h-14 pl-4 pr-4 bg-orange-400 font-semibold text-white text-3xl border-orange-900 border-2 rounded-2xl cursor-pointer"
                    onClick={setEnemyStalk}
                >
                    Stalk
                </button>
            </div>
        </div>
    );
}