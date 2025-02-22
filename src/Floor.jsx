import { RigidBody, interactionGroups } from "@react-three/rapier";


export default function Floor({ roomDimensions, position=[0, 0, 0]}) {    
    return (
        <RigidBody
            name='Floor'
            colliders={false}
            gravityScale={0}
            type='fixed'
            lockRotations
            position={[position[0], 0, position[2]]}
            collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
        >
            <mesh>
                <boxGeometry args={roomDimensions} />
                <meshStandardMaterial color='white' />
            </mesh>
        </RigidBody>
    );
}