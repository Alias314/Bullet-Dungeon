// Floor.js
import React from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";

// Create a canvas texture with a grid pattern
function createGridTexture(
    color = "#ffffff",
    bg = "#000",
    size = 512,
    gridSize = 32
) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    // Fill background with dark color
    context.fillStyle = bg;
    context.fillRect(0, 0, size, size);

    // Draw grid lines (using a thicker line for extra brightness)
    context.strokeStyle = color;
    context.lineWidth = 4; // increased line width
    for (let x = 0; x <= size; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, size);
        context.stroke();
    }
    for (let y = 0; y <= size; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(size, y);
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // Adjust repeats to match your floor dimensions
    return texture;
}

const gridEmissiveTexture = createGridTexture("#ffffff", "#000", 512, 32);

export default function Floor({ roomDimensions, position = [0, 0, 0] }) {
    return (
        <RigidBody
            name="Floor"
            colliders={false}
            gravityScale={0}
            type="fixed"
            lockRotations
            position={[position[0], 0, position[2]]}
            collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={roomDimensions} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    );
}
