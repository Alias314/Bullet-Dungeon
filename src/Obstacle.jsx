import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

export default function Obstacle({ position }) {
    const texture = useLoader(THREE.TextureLoader, "/assets/textures/stone_slab_top.png");

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;

    return (
        <RigidBody type="fixed" colliders="cuboid" position={position}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </RigidBody>
    );
}
