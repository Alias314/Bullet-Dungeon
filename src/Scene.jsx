import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { emptyRoom, xObstacleRoom } from "./RoomLayout";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Wall from "./Wall";
import Floor from "./Floor";
import { Raycaster, Vector2, Vector3, Plane } from "three";

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

export default function Scene() {
    const playerRef = useRef();
    const [mouse, setMouse] = useState(new Vector2());
    const roomSize = 15;
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
            else if (emptyRoom[i][j] === 2) {
                room.push(
                    <Wall 
                        key={`wall-${i}-${j}`}
                        position={[i - 5, 2.5, j - 5]}
                    />
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
            <div>
                {mouse}
            </div>
            <Canvas

                camera={{ position: [0, 15, 10] }}
            >
                <ambientLight />
                <directionalLight />
                
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
                    </Physics>
                </Suspense>
            </Canvas>
        </div>
    );
}