import React, { useMemo } from "react";
import { EmptyRoom } from "./RoomLayout";
import { Hallway } from "./Hallway";

// A simple procedural level generator
function generateLevel(numRooms = 5) {
    const rooms = [];
    const connections = [];

    // Start at (0, 0)
    const start = { x: 0, z: 0 };
    rooms.push(start);
    let currentRoom = start;

    // Directions: right, left, forward, backward
    const directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
    ];

    for (let i = 1; i < numRooms; i++) {
        // Filter out directions that would create duplicate rooms
        const possibleDirections = directions.filter(
            (dir) =>
                !rooms.find(
                    (room) =>
                        room.x === currentRoom.x + dir.x &&
                        room.z === currentRoom.z + dir.z
                )
        );

        if (possibleDirections.length === 0) break; // no new room can be placed

        const chosen =
            possibleDirections[
                Math.floor(Math.random() * possibleDirections.length)
            ];
        const newRoom = {
            x: currentRoom.x + chosen.x,
            z: currentRoom.z + chosen.z,
        };
        rooms.push(newRoom);
        connections.push({ from: currentRoom, to: newRoom });
        currentRoom = newRoom;
    }

    return { rooms, connections };
}

// Memoize LevelLayout so it doesn't re-render unnecessarily
const LevelLayout = React.memo(function LevelLayout() {
    // useMemo ensures the level is generated only once on mount
    const { rooms, connections } = useMemo(() => generateLevel(6), []);
    const roomSpacing = 30; // Adjust this spacing to match your room dimensions

    return (
        <>
            {rooms.map((room, index) => (
                <EmptyRoom
                    key={`room-${index}`}
                    position={[room.x * roomSpacing, 0, room.z * roomSpacing]}
                    amountEnemy={6} // adjust as needed
                />
            ))}
            {connections.map((conn, index) => {
                // Calculate midpoint between the two rooms
                const midX = ((conn.from.x + conn.to.x) / 2) * roomSpacing;
                const midZ = ((conn.from.z + conn.to.z) / 2) * roomSpacing;
                // Calculate rotation based on connection direction
                const dx = conn.to.x - conn.from.x;
                const dz = conn.to.z - conn.from.z;
                const rotationY = Math.atan2(dz, dx);
                return (
                    <Hallway
                        key={`hallway-${index}`}
                        position={[midX, 0, midZ]}
                        rotation={[0, rotationY, 0]}
                    />
                );
            })}
        </>
    );
});

export default LevelLayout;
