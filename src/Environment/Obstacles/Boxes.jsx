import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody, interactionGroups } from "@react-three/rapier";

export function BoxDestructible({ position }) {
    const texture = useLoader(
        THREE.TextureLoader,
        "/assets/textures/stonebrick_cracked.png"
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

export function BoxNonDestructible({ position }) {
    const texture = useLoader(
        THREE.TextureLoader,
        "/assets/textures/stonebrick_cracked.png"
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