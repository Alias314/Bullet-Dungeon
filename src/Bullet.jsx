import { useRef, useEffect } from "react";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

export function PlayerBullet({ id, size, position, velocity, handleBulletCollision }) {
    const bulletRef = useRef();

    useEffect(() => {
        if (bulletRef.current) {
            bulletRef.current.setLinvel(velocity, true);
        }
    }, [velocity]);

    return (
        <RigidBody
            ref={bulletRef}
            name='playerBullet'
            colliders='ball'
            type='dynamic'
            gravityScale={0}
            collisionGroups={interactionGroups(2, [1, 4])}
            onCollisionEnter={({ manifold, target, other }) => {
                handleBulletCollision(manifold, target, other, id);
            }}
        >
            <mesh position={position}>
                <sphereGeometry args={size} />
                <meshStandardMaterial color='orange' />
            </mesh>
        </RigidBody>
    );
}

export function EnemyBullet({ id, size, position, velocity, handleBulletCollision }) {
    const bulletRef = useRef();

    useEffect(() => {
        if (bulletRef.current) {
            bulletRef.current.setLinvel(velocity, true);
        }
    }, [velocity]);

    return (
        <RigidBody
            ref={bulletRef}
            name='enemyBullet'
            colliders='ball'
            type='dynamic'
            gravityScale={0}
            collisionGroups={interactionGroups(3, [0, 4])}
            onCollisionEnter={({ manifold, target, other }) => {
                handleBulletCollision(manifold, target, other, id);
            }}
        >
            <mesh position={position}>
                <sphereGeometry args={size} />
                <meshStandardMaterial color='red' />
            </mesh>
        </RigidBody>
    );
}