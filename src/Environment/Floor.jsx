import React, { useMemo } from "react";
import * as THREE from "three";

export default function Floor({ roomDimensions, position = [0, 0, 0] }) {
  // Define the constant cell size in world units.
  const worldCellSize = 1; // Adjust to change the cell size in world units

  const gridTexture = useMemo(() => {
    // Create a canvas that represents one grid cell.
    const cellPixelSize = 256; // Resolution of one cell texture (adjust as needed)
    const canvas = document.createElement("canvas");
    canvas.width = cellPixelSize;
    canvas.height = cellPixelSize;
    const ctx = canvas.getContext("2d");

    // Fill the cell with white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cellPixelSize, cellPixelSize);

    // Draw grid lines (on bottom and right edges)
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 5;
    // Bottom edge
    ctx.beginPath();
    ctx.moveTo(0, cellPixelSize - 1);
    ctx.lineTo(cellPixelSize, cellPixelSize - 1);
    ctx.stroke();
    // Right edge
    ctx.beginPath();
    ctx.moveTo(cellPixelSize - 1, 0);
    ctx.lineTo(cellPixelSize - 1, cellPixelSize);
    ctx.stroke();

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Set the repeat so that each cell covers `worldCellSize` units.
    // roomDimensions = [width, height, depth]
    texture.repeat.set(roomDimensions[0] / worldCellSize, roomDimensions[2] / worldCellSize);

    // (Optional) Use nearest filtering for a crisp grid look.
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipmapLinearFilter;
    return texture;
  }, [roomDimensions, worldCellSize]);

  return (
    <mesh position={[position[0], 0, position[2]]} receiveShadow>
      {/* Using a boxGeometry as the floor. The grid will appear on the faces with UVs */}
      <boxGeometry args={roomDimensions} />
      <meshStandardMaterial map={gridTexture} />
    </mesh>
  );
}
