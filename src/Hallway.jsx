import Floor from "./Floor";
import Wall from "./Wall";
import Gate from "./Gate";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Hallway({ position }) {
    const meshRef = useRef();
    const roomSize = 8;
    const roomDimensions = [
        roomSize,
        1,
        roomSize,
    ];
    const walls = []

    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if ((i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
                !(j >= 1 && j <= 6)) {
                walls.push(
                    <Wall
                        key={`${i}-${j}`}
                        position={[
                            position[0] + i - roomSize / 2 + 0.5,
                            2,
                            position[2] + j - roomSize / 2 + 0.5,
                        ]}
                    />
                )
            }
        }
    }

    return (
        <mesh
            ref={meshRef}
        >
            <Floor roomDimensions={roomDimensions} position={position} />
            {walls}
        </mesh>
    );
}