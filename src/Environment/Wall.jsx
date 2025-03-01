import React from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

// Create a grid texture for the wall
function createGridTexture(
    color = "#ff00ff",
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

    // Draw grid lines
    context.strokeStyle = color;
    context.lineWidth = 2;
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
    texture.repeat.set(1, 3); // Adjust for wall proportions
    return texture;
}

const wallGridTexture = createGridTexture("#ff00ff", "#000", 512, 32);

export default function Wall({ position }) {
    const texture = useLoader(
        THREE.TextureLoader,
        "/assets/textures/stone_slab_top.png"
    );

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;

    return (
        <RigidBody
            name="Obstacle"
            type="fixed"
            colliders="cuboid"
            position={position}
            collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
        >
            <mesh castShadow>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </RigidBody>
    );
}
