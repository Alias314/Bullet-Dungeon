import React from "react";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

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
                {/* <meshStandardMaterial map={texture} /> */}
                <meshStandardMaterial color={'orange'} />
            </mesh>
        </RigidBody>
    );
}
