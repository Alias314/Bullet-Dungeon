// HallwayMesh.jsx
import React from "react";
import { Color } from "three";
import {
  RigidBody,
  CuboidCollider,
  interactionGroups,
} from "@react-three/rapier";

export default function HallwayMesh({
  position, // [x, y, z]
  geometryArgs, // [lenX, heightY, lenZ]
  materialColor = "white",
  playerPos,
  distanceToView = 12,
}) {
  if (!playerPos) return null;

  const distX = Math.abs(position[0] - playerPos.x);
  const distZ = Math.abs(position[2] - playerPos.z);
  if (distX > distanceToView || distZ > distanceToView) return null;

  const [lenX, , lenZ] = geometryArgs; // floor size
  const wallT = 0.5; // thickness
  const wallH = 4; // height
  const horiz = lenX > lenZ; // hallway orientation

  // Wall geometry and offsets
  const wallSize = horiz
    ? [lenX, wallH, wallT]
    : [wallT, wallH, lenZ];

  const halfGap = horiz ? lenZ / 2 : lenX / 2;
  const offsets = horiz
    ? [
        [0, wallH / 2, halfGap + wallT / 2],
        [0, wallH / 2, -halfGap - wallT / 2],
      ]
    : [
        [halfGap + wallT / 2, wallH / 2, 0],
        [-halfGap - wallT / 2, wallH / 2, 0],
      ];

  const wallMaterial = {
    color: new Color(materialColor),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  };

  return (
    <group position={position}>
      {/* floor slab */}
      <mesh castShadow>
        <boxGeometry args={geometryArgs} />
        <meshStandardMaterial color={materialColor} />
      </mesh>

      {/* two transparent rigid‑body walls */}
      {offsets.map((pos, i) => (
        <RigidBody
          key={i}
          type="fixed"
          colliders={'cuboid'}
          collisionGroups={interactionGroups(4, [0, 1, 2, 3])}
        >
          <mesh position={pos}>
            <boxGeometry args={wallSize} />
            <meshStandardMaterial {...wallMaterial} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
