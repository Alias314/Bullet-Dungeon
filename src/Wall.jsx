import { interactionGroups, RigidBody } from "@react-three/rapier";

export default function Wall({ position }) {
    return (
        <RigidBody 
            type="fixed" 
            colliders="cuboid" 
            position={position}
            collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
        >
            <mesh>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>
    );
}
