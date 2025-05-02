import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useRef } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import gsap from "gsap";

export default function AfterImage({ position, rotation }) {
  const { scene } = useGLTF("/assets/models/playerAfterImage.glb");
  
  const model = useMemo(() => {
    const cloned = clone(scene);

    cloned.traverse(child => {
      if (child.isMesh) {
      
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 1;
        child.material.depthWrite = false;
      }
    });

    return cloned;
  }, [scene]);

  const matsRef = useRef([]);
  useEffect(() => {
    const list = [];
    model.traverse(child => {
      if (child.isMesh) list.push(child.material);
    });
    matsRef.current = list;

    gsap.to(list, {
      opacity: 0,
      duration: 0.15,
      ease: "power1.in",
      onComplete: () => {
        list.forEach(m => m.dispose());
      }
    });
  }, [model]);

  return (
    <primitive
      object={model}
      scale={0.5}
      position={position}
      quaternion={rotation}
    />
  );
}
