import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/models/filth.glb"); // Adjust path based on public folder
  return <primitive object={scene} />;
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <Model />
    </Canvas>
  );
}
