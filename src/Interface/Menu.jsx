import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const getRandomPosition = () => {
  const offset = 5;
  const boundary = 10;
  const x = Math.random() * boundary - offset;
  const y = Math.random() * (boundary + 5) - offset - 5;
  const z = Math.random() * boundary - offset;
  return [x, y, z];
};

function FloatingModel({ size, position, rotation }) {
  const { scene } = useGLTF("/assets/models/knightPlayer.glb");
  const modelRef = useRef();
  let time = 0;

  useFrame((_, delta) => {
    time += delta;

    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(time) * 0.1 + 0.4 + position[1];
      modelRef.current.rotation.y = Math.cos(time) * 0.05 + rotation[1];
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={position}
      scale={size}
      rotation={rotation}
    />
  );
}

function Particle({ size }) {
  const meshRef = useRef();
  const localTime = useRef(0);
  const timeOffset = useMemo(() => Math.random() * 10, []);

  useFrame((_, delta) => {
    localTime.current += delta;
    const t = localTime.current + timeOffset;

    meshRef.current.position.y += delta * 0.5;
    meshRef.current.position.x += Math.sin(t) * 0.002;

    if (meshRef.current.position.y >= 10) {
      meshRef.current.position.set(...getRandomPosition());
    }
  });

  return (
    <mesh ref={meshRef} position={getRandomPosition()} rotation={[0, 0.6, 0]}>
      <circleGeometry args={size} />
      <meshStandardMaterial color={"gray"} />
    </mesh>
  );
}

function FloatingCubes({ size, position, rotation }) {
  const meshRef = useRef(null);
  const localTime = useRef(0);
  let rotationSpeed = 0.05;
  const timeOffset = useMemo(() => Math.random() * 10, []);
  const isHovered = useRef(false);

  useFrame((_, delta) => {
    localTime.current += delta;

    let t = localTime.current + timeOffset;

    if (isHovered.current && rotationSpeed <= 2) {
      rotationSpeed += 0.01;
    }
    else if (!isHovered.current && rotationSpeed >= 0.05) {
      rotationSpeed -= 0.01;
    }

    meshRef.current.position.y = Math.sin(t) * 0.2 + position[1];
    meshRef.current.rotation.x += rotationSpeed * 0.01;
    meshRef.current.rotation.z += rotationSpeed * 0.01;
  });

  return (
    <mesh
      onPointerOver={() => (isHovered.current = true)}
      onPointerOut={() => (isHovered.current = false)}
      ref={meshRef}
      position={position}
      rotation={rotation}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const particles = [];
  const amountParticles = 250;
  const backgroundTransitionRef = useRef();


  for (let i = 0; i < amountParticles; i++) {
    particles.push(<Particle key={i} size={[0.0055, 12]} />);
  }

  const handlePlay = () => {
    gsap.to(backgroundTransitionRef.current, {opacity: 1, duration: 0.5, ease: "power2.out"});

    setTimeout(() => {
      navigate("/scene");
    }, 1000);
  };

  const handleAbout = () => {
    const about = document.getElementById("about");
    if (about) about.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="w-screen h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, white 65%, #BFBFBF 100%)",
      }}
    >
      <Canvas camera={{ position: [2, 1, 3] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 10, 10]} intensity={1} castShadow />

        <FloatingModel
          size={0.55}
          position={[1.9, 0, -2]}
          rotation={[-0.2, -0.25, 0]}
        />
        <FloatingCubes
          size={[1, 1, 1]}
          position={[-0.5, 0, -4]}
          rotation={[0.5, 0, 0]}
        />
        <FloatingCubes
          size={[0.8, 0.8, 0.8]}
          position={[1, -2, -3]}
          rotation={[0, 0.5, 0.5]}
        />
        <FloatingCubes
          size={[1.3, 1.3, 1.3]}
          position={[3.3, -2, -2.5]}
          rotation={[0.8, 0, 0.9]}
        />
        <FloatingCubes
          size={[1.6, 1.6, 1.6]}
          position={[4.5, 0, -7]}
          rotation={[0, 1, 2]}
        />
        <FloatingCubes
          size={[1, 1, 1]}
          position={[1, 2.4, -6]}
          rotation={[0.3, 1, 0.7]}
        />
        <FloatingCubes
          size={[0.5, 0.5, 0.5]}
          position={[0.7, -1.3, 0.3]}
          rotation={[0.3, 1, 0.7]}
        />

        {particles}
      </Canvas>

      <h1 className="absolute top-8 left-8 text-2xl text-center font-title text-black font-bold z-10">
        Gungeon
      </h1>

      <div className="absolute flex flex-col top-80 left-30">
        <h1 className="mb-10 text-5xl">A Fast-Paced Dungeon Shooter</h1>
        <p className="w-150 mb-8 text-xl text-gray-800 leading-relaxed">
          Gungeon is a top-down dungeon crawler where you fight your way through
          random rooms filled with enemies, traps, and loot. Pick up guns, dodge
          bullets, and descend through multiple levels to face the boss. Simple
          controls, intense action, and endless replayability.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            className="py-3 px-12 text-xl text-white bg-gray-900 rounded-xl border-black border-2 hover:bg-gray-700 hover:border-gray-700 transition duration-200"
          >
            Play
          </button>
        </div>
      </div>

      {/* <section
        id="about"
        className="min-h-screen bg-white px-8 py-20 rounded-t-4xl"
      >
        <h1 className="text-4xl text-center mb-25">About</h1>
        <div className="mx-auto max-w-5xl space-y-32">
          <motion.div
            className="grid md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/images/cat.jpg"
              alt="Gameplay loop"
              className="rounded-xl shadow-lg"
            />
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Lorem Ipsum</h3>
              <p className="text-lg leading-relaxed text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error
                laboriosam velit et vero ducimus neque accusamus doloremque,
                inventore odio iure temporibus culpa! Repellat perferendis sequi
                cum aliquid. Doloribus, mollitia! Ut?
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-10 items-center md:flex-row-reverse"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/images/cat.jpg"
              alt="Weapon variety"
              className="rounded-xl shadow-lg"
            />
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Lorem Ipsum</h3>
              <p className="text-lg leading-relaxed text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Similique consectetur itaque doloremque maxime, quidem
                repudiandae eligendi dignissimos, quis dolor velit accusamus et
                dicta reiciendis temporibus? Hic, ullam assumenda. Porro,
                adipisci.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/images/cat.jpg"
              alt="Boss fight"
              className="rounded-xl shadow-lg"
            />
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Lorem Ipsum</h3>
              <p className="text-lg leading-relaxed text-gray-700">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi
                minima consequatur rem et debitis laudantium reiciendis
                temporibus quod unde vel dolorum ducimus quisquam voluptate nisi
                mollitia, sint fugit, repellendus error?
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-600 text-white py-12">
        <div className="w-full flex items-center justify-center gap-6">
          <a href="#" className="hover:text-gray-300 transition duration-150">
            GitHub
          </a>
          <a href="#" className="hover:text-gray-300 transition duration-150">
            Hello
          </a>
          <a href="#" className="hover:text-gray-300 transition duration-150">
            World
          </a>
          <a href="#" className="hover:text-gray-300 transition duration-150">
            Hmm
          </a>
        </div>
      </footer>

      <div ref={backgroundTransitionRef} className="w-full h-full fixed inset-0 bg-black opacity-0 pointer-events-none">

      </div> */}
    </div>
  );
}
