import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gameplayMusic from "../Assets/Audio/gameplayMusic.mp3";
import { useGLTF } from "@react-three/drei";

function FloatingModel() {
  const { scene } = useGLTF("/assets/models/mainMenuModel.glb");
  const modelRef = useRef();
  let time = 0;

  useFrame((_, delta) => {
    time += delta;
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(time) * 0.1;
        modelRef.current.rotation.y = Math.sin(time) * 0.1;
        modelRef.current.rotation.x = Math.cos(time) * 0.05;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, 0, 0]}
      scale={0.5}
    />
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const audioRef = useRef();

  const handlePlay = () => navigate("/scene");
  const handleSettings = () => navigate("/settings");

  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch((e) => {
          console.warn("Autoplay blocked:", e);
        });
      }
      window.removeEventListener("click", playMusic);
    };
  
    window.addEventListener("click", playMusic);
  }, []);
  
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[linear-gradient(0deg,rgba(255,136,0,1)_0%,rgba(255,136,0,0.4)_90%)]">
      {/* Title */}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [2, 1, 3] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

        <FloatingModel />
      </Canvas>
      <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-7xl text-center text-amber-900 font-title font-bold z-10">
        Geometry Dungeon
      </h1>

      {/* Button Panel */}
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

      <audio ref={audioRef} src={"assets/audio/Digestive_Biscuit.mp3"} loop hidden />
    </div>
  );
}
