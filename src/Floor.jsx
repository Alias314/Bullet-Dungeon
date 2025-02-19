import { RigidBody } from "@react-three/rapier";

export default function Floor() {    
    return (
        <RigidBody
            colliders='cuboid'
            gravityScale={0}
            type='fixed'
            lockRotations
        >
            <mesh position={[2, 0, 2]}>
                <boxGeometry args={[15, 1, 15]} />
                <meshStandardMaterial color='white' />
            </mesh>
        </RigidBody>
    );
}