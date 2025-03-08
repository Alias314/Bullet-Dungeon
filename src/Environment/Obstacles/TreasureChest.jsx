import React from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

export default function TreasureChest({ position }) {
    const texture = useLoader(
        THREE.TextureLoader,
        "/assets/textures/chest_front.png"
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
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </RigidBody>
    );
}
