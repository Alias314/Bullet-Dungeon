import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { rush, stalk, wander } from "./EnemyBehavior";

export default function Enemy({ id, playerRef, position, enemyState }) {
    const [time, setTime] = useState(0);
    const enemyRef = useRef();
    const speed = 2;
    const distanceToWander = 100;
    const [positionToWander, setPositionToWander] = useState(null)

    useFrame(() => {
        if (playerRef.current && enemyRef.current && positionToWander) {
            const playerPos = playerRef.current.translation();
            const enemyPos = enemyRef.current.translation();
            let velocity;

            if (enemyState === 'rush') {
                velocity = rush(playerPos, enemyPos, speed);
            }
            else if (enemyState === 'wander') {
                velocity = wander(positionToWander, enemyPos, speed);
            }
            else if (enemyState === 'stalk') {
                velocity = stalk(playerPos, enemyPos, speed);
            }

            enemyRef.current.setLinvel(velocity, true);
        }
    });

    useEffect(() => {
        if (enemyRef.current) {
            const enemyPos = enemyRef.current.translation();
    
            if (time % 2 === 0) {
                setPositionToWander({
                    x: enemyPos.x + (Math.random() * distanceToWander - distanceToWander / 2),
                    z: enemyPos.z + (Math.random() * distanceToWander - distanceToWander / 2),
                });
            }
    
            const interval = setInterval(() => {
                setTime(time => time + 1);
            }, Math.random() * 1000);
    
            return () => clearInterval(interval);
        }
    }, [time]);

    return (
        <RigidBody
            ref={enemyRef}
            name={`Enemy-${id}`}
            position={position}
            colliders='cuboid'
            type='dynamic'
            gravityScale={0}
            lockRotations
        >
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color={'blue'} />
            </mesh>
        </RigidBody>
    );
}