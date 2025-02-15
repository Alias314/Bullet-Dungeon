import { RigidBody } from "@react-three/rapier";

export default function Obstacle({ position }) {
    return (
        <RigidBody
            type="fixed"
            colliders='cuboid'
            position={position}
        >
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial />
            </mesh>
        </RigidBody>
    );
}