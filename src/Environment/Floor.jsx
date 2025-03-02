import React from "react";

export default function Floor({ roomDimensions, position = [0, 0, 0] }) {
    return (
        <mesh position={[position[0], 0, position[2]]} receiveShadow>
            <boxGeometry args={roomDimensions} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}
