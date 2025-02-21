import { useRef, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

export default function Bullet({ id, position, velocity, handleBulletCollision }) {
    const bulletRef = useRef();

    useEffect(() => {
        if (bulletRef.current) {
            bulletRef.current.setLinvel(velocity, true);
        }
    }, [velocity]);

    return (
        <RigidBody
            ref={bulletRef}
            name='Bullet'
            colliders='ball'
            type='dynamic'
            gravityScale={0}
            onCollisionEnter={({ manifold, target, other }) => {
                handleBulletCollision(manifold, target, other, id);
            }}
        >
            <mesh position={position}>
                <sphereGeometry args={[0.3, 4, 4]} />
                <meshStandardMaterial color='red' />
            </mesh>
        </RigidBody>
    );
}
