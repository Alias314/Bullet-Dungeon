import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

export default function Bullet({ position, velocity }) {
    const bulletRef = useRef();

    useFrame(() => {
        bulletRef.current.setLinvel(velocity, true);
    })

    return (
        <RigidBody
            ref={bulletRef}
            colliders='ball'
            type='dynamic'
            gravityScale={0}
        >
            <mesh position={position}>
                <sphereGeometry args={[0.3, 4, 4]} />
                <meshStandardMaterial color='red' />
            </mesh>
        </RigidBody>
    );
}
