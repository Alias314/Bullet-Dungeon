import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Raycaster, Vector3, Plane, Quaternion } from "three";

export default function Player({ playerRef, mouse }) {
    const meshRef = useRef();
    const raycaster = useRef(new Raycaster());
    const plane = new Plane(new Vector3(0, 1, 0), 0);
    const { camera } = useThree();
    const [keyPressed, setKeyPressed] = useState({ 
        w: false, 
        a: false, 
        s: false, 
        d: false, 
    });
    const speedMultiplier = 5;

    useFrame(() => {
        if (playerRef.current) {
            const velocity = {
                x: 0, 
                y: 0, 
                z: 0 
            };

            if (keyPressed["a"]) velocity.x = -speedMultiplier;
            if (keyPressed["d"]) velocity.x = speedMultiplier;
            if (keyPressed["w"]) velocity.z = -speedMultiplier;
            if (keyPressed["s"]) velocity.z = speedMultiplier;
            playerRef.current.setLinvel(velocity, true);

            raycaster.current.setFromCamera(mouse, camera);
            const intersectionPoint = new Vector3();
            if (raycaster.current.ray.intersectPlane(plane, intersectionPoint)) {
                const playerPos = playerRef.current.translation();
                const direction = new Vector3()
                .subVectors(intersectionPoint, playerPos)
                .normalize();

                const angle = Math.atan2(direction.x, direction.z);
                const quaternion = new Quaternion();
                quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle);
                playerRef.current.setRotation(quaternion);
            }
        }
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
        
        if (e.repeat) return;
            setKeyPressed((prev) => ({ ...prev, [e.key]: true }));
        };

        const handleKeyUp = (e) => {
            setKeyPressed((prev) => ({ ...prev, [e.key]: false }));
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <RigidBody 
            ref={playerRef}
            position={[2, 1, 2]}
            colliders='cuboid'
            type='dynamic'
            gravityScale={0}
            lockRotations
        >
            <mesh ref={meshRef}>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
    );
}
