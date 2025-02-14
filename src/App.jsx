import { Canvas, events, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react';

const getRandomPostion = () => {
  const x = Math.random() * 20 - 10;
  const y = Math.random() * 10;
  const z = Math.random() * 20 - 10;

  return [x, y, z];
}

const getRandomSpeed = () => {
  return Math.random();
}

const getRandomCOlor = () => {
  // const c
}

function Player({ playerRef }) {
  const [keyPressed, setKeyPressed] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const speedMultiplier = 0.04;

  useFrame(() => {
    if (keyPressed['a']) {
      playerRef.current.position.x -= speedMultiplier;
    }
    if (keyPressed['d']) {
      playerRef.current.position.x += speedMultiplier;
    }
    if (keyPressed['w']) {
      playerRef.current.position.z -= speedMultiplier;
    }
    if (keyPressed['s']) {
      playerRef.current.position.z += speedMultiplier;
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
      ref={playerRef}
    >
      <boxGeometry />
      <meshStandardMaterial
        color='red'
      />
    </mesh>
  );
}

function Enemy({ position, playerRef }) {
  const meshRef = useRef();
  const speedMultiplier = getRandomSpeed() / 50;
  let count = 0;
  
  useFrame((_, delta) => {
    count += delta;
    
    meshRef.current.position.x += (meshRef.current.position.x > playerRef.current.position.x) ? -(speedMultiplier) : speedMultiplier;
    meshRef.current.position.y += (meshRef.current.position.y > playerRef.current.position.y) ? -(speedMultiplier) : speedMultiplier;
    meshRef.current.position.z += (meshRef.current.position.z > playerRef.current.position.z) ? -(speedMultiplier) : speedMultiplier;

    meshRef.current.position.x += Math.cos(count) * 0.03;
    meshRef.current.position.z += Math.sin(count) * 0.03;
    // meshRef.current.position.y += Math.tan(count) * 0.001;
  });
  
  return (
    <mesh
      ref={meshRef} 
      position={position}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshToonMaterial color='white' />
    </mesh>
  );
}

export default function App() {
  const playerRef = useRef();
  const enemies = [];
  const enemyAmount = 1000;

  for (let i = 0; i < enemyAmount; i++) {
    enemies.push(
      <Enemy 
        key={i}
        position={getRandomPostion()}
        playerRef={playerRef}
      />
    )
  }

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{position: [0, 5, 5]}}>
        <directionalLight position={[10, 10, 10]}/>
        <gridHelper args={[10, 10]} />

        <Player playerRef={playerRef} />
        
        {enemies}
      </Canvas>
    </div>
  );
}