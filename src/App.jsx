import { useRef } from 'react';
import Obstacle from './Obstacle';
import Scene from './Scene';
import { useFrame } from '@react-three/fiber';
import { Canvas } from "@react-three/fiber";

function Wave({ counter, position }) {
  const meshRef = useRef();
  const speed = 0.01;

  useFrame((_, delta) => {
    counter += delta;

    meshRef.current.position.y += Math.cos(counter) * speed;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
    >
      <planeGeometry />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
}

export default function App() {
  let waves = [];
  const size = 30;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      waves.push(
        <Wave 
          key={Math.random()}
          counter={(i + j) / 5}
          position={[i - 10, 0, j - 10]}
        />
      )
    }
  }

  return (
    <div className="w-screen h-screen">
      <Scene />
      {/* <Canvas camera={{ position: [0, 30, 30] }}>
        <ambientLight />
        <directionalLight />
        {waves}
      </Canvas> */}
    </div>
  );
}