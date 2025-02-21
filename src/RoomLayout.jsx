import Floor from "./Floor";
import Wall from "./Wall";
import Gate from "./Gate";

export function EmptyRoom() {
    const roomSize = 25;
    const roomDimensions = [
        roomSize,
        1,
        roomSize,
    ];
    const position = [0, 0, 0];
    const walls = []

    for (let i = 0; i < roomSize; i++) {
        for (let j = 0; j < roomSize; j++) {
            if ((i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
                (i >= 10 && i <= 15 || j >= 10 && j <= 15)) {
                walls.push(
                    <Gate 
                        position={[
                            position[0] + i - roomSize / 2 + 0.5,
                            1.3,
                            position[2] + j - roomSize / 2 + 0.5,
                        ]}
                    />
                )
            }
            if ((i === 0 || j === 0 || i === roomSize - 1 || j === roomSize - 1) &&
                !(i >= 10 && i <= 15 || j >= 10 && j <= 15)) {
                walls.push(
                    <Wall 
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
        <>
            <Floor roomDimensions={roomDimensions} position={position} />
            {walls}
        </>
    );
}