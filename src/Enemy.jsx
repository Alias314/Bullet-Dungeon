import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { rush, stalk, wander } from "./EnemyBehavior";

export default function Enemy({ playerRef, position }) {
    const [time, setTime] = useState(0);
    const enemyRef = useRef();
    const speed = 2;
    const distanceToWander = 100;
    const [positionToWander, setPositionToWander] = useState()

    useFrame(() => {
        if (playerRef.current && enemyRef.current) {
            const playerPos = playerRef.current.translation();
            const enemyPos = enemyRef.current.translation();
            
            // const velocity = rush(playerPos, enemyPos, speed);
            const velocity = wander(positionToWander, enemyPos, speed);
            // const velocity = stalk(playerPos, enemyPos, speed);

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
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [time]);

    return (
        <RigidBody
            ref={enemyRef}
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