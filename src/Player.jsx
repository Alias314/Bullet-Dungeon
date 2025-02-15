import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier"

export default function Player({ playerRef }) {
    const [keyPressed, setKeyPressed] = useState({
        w: false,
        a: false,
        s: false,
        d: false,
    });
    const speedMultiplier = 5;
    
    useFrame(() => {
        if (!playerRef.current) {
            return;
        }

        const velocity = {
            x: 0,
            y: 0,
            z: 0,
        };

        if (keyPressed["a"]) {
            velocity.x = -speedMultiplier;
        }
        if (keyPressed["d"]) {
            velocity.x = speedMultiplier;
        }
        if (keyPressed["w"]) {
            velocity.z = -speedMultiplier;
        }
        if (keyPressed["s"]) {
            velocity.z = speedMultiplier;
        }

        playerRef.current.setLinvel(velocity, true);
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.repeat) {
            return;
        }

        setKeyPressed((prev) => ({
            ...prev,
            [e.key]: true,
        }));
        };

        const handleKeyUp = (e) => {
        setKeyPressed((prev) => ({
            ...prev,
            [e.key]: false,
        }));
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
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
    );
}
