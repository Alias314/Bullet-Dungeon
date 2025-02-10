import { Canvas, events, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react';

// will seperate to different component later
function Player() {
  const meshRef = useRef();
  const [keyPressed, setKeyPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const speedMultiplier = 0.04;

  useFrame(() => {
    if (keyPressed['a']) {
      meshRef.current.position.x -= speedMultiplier;
    }
    if (keyPressed['d']) {
      meshRef.current.position.x += speedMultiplier;
    }
    if (keyPressed['w']) {
      meshRef.current.position.z -= speedMultiplier;
    }
    if (keyPressed['s']) {
      meshRef.current.position.z += speedMultiplier;
    }
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
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <mesh
      ref={meshRef}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{position: [0, 5, 5]}}>
        <directionalLight position={[10, 10, 10]}/>
        <gridHelper args={[10, 10]} />
        
        <Player />
      </Canvas>
    </div>
  );
}