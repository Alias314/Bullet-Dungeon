import { Canvas } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Planet({ size, color, wireframe, minSpeed, isHovered }) {
  const meshRef = useRef();
  const speed = useRef(0);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    if (isHovered.current) {
      speed.current = Math.min(speed.current + 0.02, 1);
    } 
    else {
      speed.current = Math.max(speed.current - 0.04, minSpeed);
    }

    meshRef.current.rotation.y += speed.current * 0.05;
    meshRef.current.rotation.x += speed.current * 0.02;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => (isHovered.current = true)}
      onPointerOut={() => (isHovered.current = false)}
    >
      <octahedronGeometry args={[2 + size, 3]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
      />
    </mesh>
  );
}

function Asteroid() {
  const meshRef = useRef();
  let elapsed = 0;

  useFrame((_, delta) => {
    elapsed += delta;
    
    meshRef.current.position.x = Math.sin(elapsed) * 4;
    meshRef.current.position.y = Math.sin(elapsed);
    meshRef.current.position.z = Math.cos(elapsed) * 4;
  })

  return (
    <mesh
      ref={meshRef}
    >
      <octahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function App() {
  const isHovered = useRef(false);

  return (
    <div className='w-screen h-screen'>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} castShadow={true} />
        {/* <gridHelper args={[10, 10]} /> */}

        <Planet size={0.5} color='blue' minSpeed={0.2} isHovered={isHovered} />
        <Planet size={1.9} color='white' wireframe={true} minSpeed={0.05} isHovered={isHovered} />

        <Asteroid />
      </Canvas>
    </div>
  );
}