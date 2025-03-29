import React from "react";

export default function HallwayMesh({
  position,
  geometryArgs,
  materialColor = "white",
  playerPos,
}) {
  const distanceToView = 12;
  const absoluteDistance = playerPos
    ? [
        Math.abs(position[0] - playerPos.x),
        0,
        Math.abs(position[2] - playerPos.z),
      ]
    : null;

  return (
    <>
      {playerPos &&
        absoluteDistance &&
        absoluteDistance[0] <= distanceToView &&
        absoluteDistance[2] <= distanceToView && (
          <mesh position={position} castShadow>
            <boxGeometry args={geometryArgs} />
            <meshStandardMaterial color={materialColor} />
          </mesh>
        )}
    </>
  );
}
