import { RigidBody } from "@react-three/rapier";

export default function Gate({ position }) {
    return (
        <RigidBody 
            type="fixed" 
            colliders="cuboid" 
            position={position}
        >
            <mesh>
                <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
                <meshStandardMaterial color='gray' />
            </mesh>
        </RigidBody>
    );
}