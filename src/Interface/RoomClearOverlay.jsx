import React from "react";

export default function RoomCLearOverlay() {
  return (
    <div
    className="absolute inset-0 flex items-center justify-center text-white text-5xl font-semibold shadow-2xl shadow-black"
      style={{
        animation: "fadeOut 3s forwards",
      }}
    >
      <h1>Room Cleared!</h1>
    </div>
  );
}
