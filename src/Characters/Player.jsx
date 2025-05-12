import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  interactionGroups,
  RigidBody,
} from "@react-three/rapier";
import { Raycaster, Vector3, Plane, Quaternion, StaticReadUsage } from "three";
import { useGLTF } from "@react-three/drei";
import Pistol from "../Environment/Items/Pistol";
import MachineGun from "../Environment/Items/MachineGun";
import Shotgun from "../Environment/Items/Shotgun";
import MovementParticle from "./AfterImage";
import Shield from "./Shield";
import { usePlayerStore } from "../Interface/Logic/usePlayerStore";
import FireAura from "./FireAura";
import HitParticles from "./HitParticles";

export default function Player({
  playerRef,
  mouse,
  setPlayerDirection,
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
  const isDashing = usePlayerStore((state) => state.isDashing);
  const setIsDashing = usePlayerStore((state) => state.setIsDashing);
  const [dashDirection, setDashDirection] = useState(new Vector3());
  const dashAudioRef = useRef();
  const localTime = useRef(0);
  const [afterImage, setAfterImage] = useState([]);
  const lastQuatRef = useRef(new Quaternion());
  const counter = useRef(0);
  const stats = usePlayerStore((state) => state.stats);
  const increaseStat = usePlayerStore((state) => state.increaseStat);
  
  useEffect(() => {
    dashAudioRef.current = new Audio("assets/audio/Retro_Swooosh_16.wav");
  }, []);

  useFrame((_, delta) => {
    localTime.current += delta * 8;

    if (playerRef.current && isGameRunning.current) {
      let input = new Vector3(
        (keyPressed["d"] ? 1 : 0) + (keyPressed["a"] ? -1 : 0),
        0,
        (keyPressed["s"] ? 1 : 0) + (keyPressed["w"] ? -1 : 0)
      );

      if (isDashing) {
        input = dashDirection.clone().multiplyScalar(stats.dashForce);
        counter.current++;

        if (counter.current % 4 === 0) {
          const p = playerRef.current.translation();
          const position = new Vector3(p.x, p.y + 0.3, p.z);

          setAfterImage((list) =>
            [
              ...list,
              {
                id: `${Date.now()}-${Math.random()}`,
                position: position,
                rotation: lastQuatRef.current.clone(),
              },
            ].slice(-10)
          );
        }
      } else if (input.length() > 0) {
        input.normalize().multiplyScalar(stats.speed);
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
        lastQuatRef.current.copy(quaternion);

        setPlayerDirection(direction);
      }
    } else if (!isGameRunning.current) {
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (knightHeadRef.current) {
      knightHeadRef.current.position.y =
        Math.sin(localTime.current) * 0.03 + 0.7;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (e.code === "Space" && stats.dashes > 0 && !isDashing) {
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
          increaseStat("dashes", -1);

          setTimeout(() => {
            setIsDashing(false);
          }, stats.dashDuration);

          setTimeout(() => {
            setAfterImage([]);
          }, 1000);
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
    if (stats.dashes < stats.maxDashes) {
      const interval = setInterval(() => {
        increaseStat("dashes", 1);
      }, stats.dashCooldown);

      return () => clearInterval(interval);
    }
  }, [stats.dashes]);

  const { scene: knightBody } = useGLTF("/assets/models/knightBody.glb");
  const { scene: knightHead } = useGLTF("/assets/models/knightHead.glb");
  const knightHeadRef = useRef(null);

  return (
    <>
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
          <Pistol key={1} currentWeapon={currentWeapon} isShoot={isShoot} />
        )}
        {currentWeapon === "machineGun" && (
          <MachineGun key={2} currentWeapon={currentWeapon} isShoot={isShoot} />
        )}
        {currentWeapon === "shotgun" && (
          <Shotgun key={3} currentWeapon={currentWeapon} isShoot={isShoot} />
        )}
        <CuboidCollider args={[0.5, 0.5, 0.5]} />
      </RigidBody>

      {afterImage.map((prev) => (
        <MovementParticle
          key={prev.id}
          position={prev.position}
          rotation={prev.rotation}
        />
      ))}
    </>
  );
}
