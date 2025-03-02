import Floor from "./Floor";
import Wall from "./Wall";
import { useRef } from "react";

export function HallwayVertical({ position }) {
    const meshRef = useRef();
    const roomSize = 6;
    const roomDimensions = [roomSize, 1, roomSize];
    const walls = [];
    const offset = 0.5;

    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if (
                (i === 0 ||
                    j === 0 ||
                    i === roomSize - 1 ||
                    j === roomSize - 1) &&
                !(i >= 1 && i <= 4)
            ) {
                walls.push(
                    <Wall
                        key={`${i}-${j}`}
                        position={[
                            position[0] + i - roomSize / 2 + offset,
                            2,
                            position[2] + j - roomDimensions[2] / 2 + offset,
                        ]}
                    />
                );
            }
        }
    }

    return (
        <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <Floor roomDimensions={roomDimensions} position={position} />
            {walls}
        </mesh>
    );
}

export function HallwayHorizontal({ position }) {
    const meshRef = useRef();
    const roomSize = 6;
    const roomDimensions = [roomSize + 2, 1, roomSize - 2];
    const walls = [];
    const offset = 0.5;

    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if (
                (i === 1 ||
                    j === 0 ||
                    i === roomSize - 1 ||
                    j === roomSize - 1) &&
                !(j >= 1 && j <= 4)
            ) {
                walls.push(
                    <Wall
                        key={`${i}-${j}`}
                        position={[
                            position[0] + i - roomSize / 2 + offset,
                            2,
                            position[2] + j - roomSize / 2 + offset,
                        ]}
                    />
                );
            }
        }
    }

    return (
        <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <Floor roomDimensions={roomDimensions} position={position} />
            {walls}
        </mesh>
    );
}
