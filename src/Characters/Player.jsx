import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RigidBody,
} from "@react-three/rapier";
import { Raycaster, Vector3, Plane, Quaternion } from "three";
import { useGLTF } from "@react-three/drei";
import Pistol from "../Environment/Items/Pistol";
import MachineGun from "../Environment/Items/MachineGun";
import Shotgun from "../Environment/Items/Shotgun"

export default function Player({
  playerRef,
  mouse,
  setPlayerDirection,
  dashBar,
  setDashBar,
  dashCooldown,
  maxDashBar,
  isGameRunning,
  currentWeapon,
  isShoot,
}) {
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
  const [isDashing, setIsDashing] = useState(false);
  const [dashDirection, setDashDirection] = useState(new Vector3());
  const speedMultiplier = 8;
  const dashForce = 20;
  const dashDuration = 0.2;
  const dashAudioRef = useRef();
  useEffect(() => {
    dashAudioRef.current = new Audio("assets/audio/Retro_Swooosh_16.wav");
  }, []);
  const localTime = useRef(0);

  useFrame((_, delta) => {
    if (playerRef.current && isGameRunning.current) {
      let input = new Vector3(
        (keyPressed["d"] ? 1 : 0) + (keyPressed["a"] ? -1 : 0),
        0,
        (keyPressed["s"] ? 1 : 0) + (keyPressed["w"] ? -1 : 0)
      );

      if (isDashing) {
        input = dashDirection.clone().multiplyScalar(dashForce);
      } else if (input.length() > 0) {
        input.normalize().multiplyScalar(speedMultiplier);
      }

      playerRef.current.setLinvel({ x: input.x, y: 0, z: input.z }, true);

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

        setPlayerDirection(direction);
      }
    } else if (!isGameRunning.current) {
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (knightHeadRef.current) {
      localTime.current += delta * 8;

      knightHeadRef.current.position.y =
        Math.sin(localTime.current) * 0.03 + 0.7;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (e.code === "Space" && dashBar > 0 && !isDashing) {
        if (dashAudioRef.current) {
          const soundClone = dashAudioRef.current.cloneNode();
          soundClone.play();
        }

        const input = new Vector3(
          (keyPressed["d"] ? 1 : 0) + (keyPressed["a"] ? -1 : 0),
          0,
          (keyPressed["s"] ? 1 : 0) + (keyPressed["w"] ? -1 : 0)
        );
        if (!isDashing && input.length() > 0) {
          input.normalize();
          setDashDirection(input);
          setIsDashing(true);
          setDashBar((prev) => prev - 1);
          setTimeout(() => {
            setIsDashing(false);
          }, dashDuration * 1000);
        }
      } else {
        setKeyPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.code !== "Space") {
        setKeyPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyPressed, isDashing]);

  useEffect(() => {
    if (dashBar < maxDashBar) {
      const interval = setInterval(() => {
        setDashBar((prev) => prev + 1);
      }, dashCooldown);

      return () => clearInterval(interval);
    }
  }, [dashBar]);

  const { scene: knightBody } = useGLTF("/assets/models/knightBody.glb");
  const { scene: knightHead } = useGLTF("/assets/models/knightHead.glb");
  const knightHeadRef = useRef(null);

  return (
    <RigidBody
      ref={playerRef}
      name="Player"
      position={[0, 1, 0]}
      colliders={false}
      type="dynamic"
      gravityScale={0}
      collisionGroups={
        isDashing
          ? interactionGroups(10, [4])
          : interactionGroups(0, [1, 3, 4, 5])
      }
      lockRotations
    >
      <primitive object={knightBody} position={[0, 0, 0]} scale={0.5} />
      <primitive
        ref={knightHeadRef}
        object={knightHead}
        position={[0, 0.7, 0]}
        scale={0.5}
      />

      {currentWeapon === "pistol" && (
        <Pistol
          key={1}
          currentWeapon={currentWeapon}
          isShoot={isShoot}
        />
      )}
      {currentWeapon === "machineGun" && (
        <MachineGun
          key={2}
          currentWeapon={currentWeapon}
          isShoot={isShoot}
        />
      )}
      {currentWeapon === "shotgun" && (
        <Shotgun
          key={3}
          currentWeapon={currentWeapon}
          isShoot={isShoot}
        />
      )}

      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}
