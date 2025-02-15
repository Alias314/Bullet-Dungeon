import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { emptyRoom, xObstacleRoom } from "./RoomLayout";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Wall from "./Wall";

function CameraController({ playerRef }) {
    useFrame(({ camera }) => {
        if (playerRef.current) {
            const playerPos = playerRef.current.translation();

            camera.position.x = playerPos.x;
            camera.position.z = playerPos.z + 10;
        }
    });
}

export default function Scene() {
    const playerRef = useRef();
    let room = [];
    let roomSize = 15;
    
    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if (xObstacleRoom[i][j] === 1) {
                room.push(
                    <Obstacle
                        key={Math.random()}
                        position={[i - 5, 1, j - 5]} 
                    />
                )
            }
            else if (xObstacleRoom[i][j] === 2) {
                room.push(
                    <Wall 
                        key={Math.random()}
                        position={[i - 5, 3, j - 5]}
                    />
                )
            }
        }
    }
    
    return (
        <Canvas 
            camera={{ position: [0, 15, 10] }}
        >
            <ambientLight />
            <directionalLight  />
            
            <Suspense>
                <Physics
                    interpolate={false} 
                    colliders={false}
                >
                    <CameraController playerRef={playerRef} />
                    <Player playerRef={playerRef} />
                    {room}
                </Physics>
            </Suspense>
        </Canvas>
    );
}