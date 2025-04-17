import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";

const getRandomPosition = () => {
  const offset = 5;
  const boundary = 10;
  const x = Math.random() * boundary - offset;
  const y = Math.random() * boundary - offset;
  const z = Math.random() * boundary - offset;
  return [x, y, z];
};

function FloatingModel() {
  const { scene } = useGLTF("/assets/models/knightPlayer.glb");
  // const { scene } = useGLTF("/assets/models/boss.glb");
  const modelRef = useRef();
  let time = 0;

  useFrame((_, delta) => {
    time += delta;
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(time) * 0.1 + 0.4;
      // modelRef.current.rotation.y = Math.sin(time) * 0.1;
      modelRef.current.rotation.x = Math.cos(time) * 0.05;

      // modelRef.current.position.y = Math.sin(time) * 0.1 + 0.6;
      // modelRef.current.rotation.y = time;
    }
  });

  return (
    <primitive ref={modelRef} object={scene} position={[0, 0, 0]} scale={0.5} />
    // <primitive ref={modelRef} object={scene} position={[0, 0, 0]} scale={0.2} />
  );
}

function Particle() {
  const meshRef = useRef();
  let time = 0;

  useFrame((_, delta) => {
    time += delta;

    meshRef.current.position.y += delta;
    meshRef.current.position.x += Math.sin(time) * 0.005;

    if (meshRef.current.position.y >= 10) {
      meshRef.current.position.set(...getRandomPosition());
      time = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={getRandomPosition()} rotation={[0, 0.6, 0]}>
      <circleGeometry args={[0.04, 16]} />
      <meshStandardMaterial color={"#FF9317"} />
    </mesh>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push(<Particle key={i} />);
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate("/scene");
  };

  const handleSettings = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate("/settings");
  };

  useEffect(() => {
    const audio = new Audio("/assets/audio/Digestive_Biscuit.mp3");
    audio.volume = 0.04;
    audio.loop = true;
    audio.play();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[linear-gradient(0deg,rgba(255,136,0,1)_0%,rgba(255,136,0,0.4)_90%)]">
      <Canvas camera={{ position: [2, 1, 3] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <FloatingModel />
        {particles}
      </Canvas>

      <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-7xl text-center text-amber-900 font-title font-bold z-10">
        Geometry Dungeon
      </h1>

      <div className="absolute top-45 w-full h-full flex flex-col items-center justify-center gap-4">
        <button
          onClick={handlePlay}
          className="p-4 w-64 text-3xl text-white bg-amber-700 rounded-3xl hover:bg-amber-600 transition duration-200"
        >
          Play
        </button>
        <button
          onClick={handleSettings}
          className="p-4 w-64 text-3xl text-white bg-amber-700 rounded-3xl hover:bg-amber-600 transition duration-200"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
