import { useFrame } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { follow, stalk, runAway, wander } from "./EnemyBehavior";
import { Vector3 } from "three";

export function PistolEnemy({ 
    id, 
    playerRef, 
    position, 
    setEnemyBullets,
}) {
    const [time, setTime] = useState(0);
    const enemyRef = useRef();
    const speed = 1.8;
    const distanceToWander = 100;
    const [positionToWander, setPositionToWander] = useState(null);

    useFrame(() => {
        if (playerRef.current && enemyRef.current && positionToWander) {
            const playerPos = playerRef.current.translation();
            const enemyPos = enemyRef.current.translation();
            const absoluteDistance = [
                Math.abs(playerPos.x - enemyPos.x),
                0,
                Math.abs(playerPos.z - enemyPos.z),
            ]
            const distanceToStalk = 7;
            let velocity;
            
            if (absoluteDistance[0] < distanceToStalk && absoluteDistance[2] < distanceToStalk) {
                velocity = stalk(playerPos, enemyPos, speed, absoluteDistance, distanceToStalk);
            }
            else{
                velocity = wander(positionToWander, enemyPos, speed);   
            }

            enemyRef.current.setLinvel(velocity, true);
        }
    });

    useEffect(() => {
        if (enemyRef.current) {
            const interval = setInterval(() => {
                const enemyPos = enemyRef.current.translation();

                if (time % 3 === 0) {
                    setPositionToWander({
                        x: enemyPos.x + (Math.random() * distanceToWander - distanceToWander / 2),
                        z: enemyPos.z + (Math.random() * distanceToWander - distanceToWander / 2),
                    });
                }

                setTime(time => time + 1);
            }, Math.random() * 1000);

            return () => clearInterval(interval);
        }
    }, [time]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && enemyRef.current) {
                const playerPos = playerRef.current.translation();
                const enemyPos = enemyRef.current.translation();
                const bulletSpeed = 10;
                const direction = new Vector3(
                    playerPos.x - enemyPos.x,
                    playerPos.y - enemyPos.y,
                    playerPos.z - enemyPos.z,
                ).normalize();
                const velocity = {
                    x: direction.x * bulletSpeed,
                    y: direction.y * bulletSpeed,
                    z: direction.z * bulletSpeed,
                };

                setEnemyBullets(prev => [
                    ...prev,
                    {
                        id: Math.random(),

                        position: [
                            enemyPos.x,
                            enemyPos.y,
                            enemyPos.z,
                        ],
                        velocity,
                    }
                ]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [playerRef, enemyRef]);

    return (
        <>
            <RigidBody
                ref={enemyRef}
                name={`Enemy-${id}`}
                position={position}
                colliders='cuboid'
                type='dynamic'
                gravityScale={0}
                collisionGroups={interactionGroups(1, [0, 1, 2, 4])}
                lockRotations
            >
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color={'red'} />
                </mesh>
            </RigidBody>
        </>
    );
}

export function MeleeEnemy({ 
    id, 
    playerRef, 
    position, 
}) {
    const enemyRef = useRef();
    const speed = 2.3;

    useFrame(() => {
        if (playerRef.current && enemyRef.current) {
            const playerPos = playerRef.current.translation();
            const enemyPos = enemyRef.current.translation();
            const velocity = follow(playerPos, enemyPos, speed);

            enemyRef.current.setLinvel(velocity, true);
        }
    });

    return (
        <>
            <RigidBody
                ref={enemyRef}
                name={`Enemy-${id}`}
                position={position}
                colliders='cuboid'
                type='dynamic'
                gravityScale={0}
                collisionGroups={interactionGroups(1, [0, 1, 2, 4])}
                lockRotations
            >
                <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color={'red'} />
                </mesh>
            </RigidBody>
        </>
    );
}