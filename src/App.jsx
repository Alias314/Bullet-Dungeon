import { Canvas } from '@react-three/fiber'
import Player from './Player';

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