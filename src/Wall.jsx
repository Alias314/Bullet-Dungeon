import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

export default function Wall({ position }) {
    const texture = useLoader(THREE.TextureLoader, "/assets/textures/stonebrick.png");

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;

    return (
        <RigidBody
            name='Wall' 
            type='fixed' 
            colliders='cuboid' 
            position={position}
        >
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial map={texture} />
            </mesh>
        </RigidBody>
    );
}