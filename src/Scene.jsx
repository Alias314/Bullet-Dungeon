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
    const playerRef = useRef();
    const [mouse, setMouse] = useState(new Vector2());
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

    useEffect(() => {
        const handlePointerMove = (e) => {
            setMouse(
                new Vector2(
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                )
            );
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, []);

    return (
        <div className="w-full h-full">
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
                        />
                        {room}
                        {enemySpawn}
                    </Physics>
                </Suspense>
            </Canvas>
        </div>
    );
}