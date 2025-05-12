import { RigidBody, interactionGroups } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function WoodenBox({ position }) {
  const { scene: box } = useGLTF("/assets/models/woodenBox.glb");
  const boxModel = useMemo(() => clone(box), [box]);

  return (
    <RigidBody
      name="Obstacle"
      type="fixed"
      colliders="cuboid"
      position={position}
      collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
    >
      <primitive
        object={boxModel}
        scale={0.5}
      />
    </RigidBody>
  );
}
