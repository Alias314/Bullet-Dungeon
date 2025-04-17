import { useEffect } from "react";
import PowerUpCard from "./PowerUpCard";

export default function PowerUpOverlay({
  displayPowerUpOverlay,
  setDashBar,
  dashCooldown,
  maxDashBar,
  setPlayerBullets,
  playerRef,
}) {
  const playerPos =
    playerRef && playerRef.current ? playerRef.current.translation() : null;

  const ninja = () => {
    setDashBar(4);
    dashCooldown.current = 500;
    maxDashBar.current = 4;
    closeOverlay();
  };

  const closeOverlay = () => {
    displayPowerUpOverlay(false);
  };

  const powerUps = {
    ninja: {
      title: "Ninja",
      description: "Double the amount of dashes and halves the dash cooldown.",
      onSelectFunction: ninja,
    },
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 opacity-90">
      <h2 className="text-5xl text-white font-bold mb-8">Choose Power Up</h2>
      <div className="flex gap-10 text-black">
        <PowerUpCard
          title={powerUps.ninja.title}
          description={powerUps.ninja.description}
          onSelectFunction={powerUps.ninja.onSelectFunction}
        />

        <PowerUpCard
          title={powerUps.ninja.title}
          description={powerUps.ninja.description}
          onSelectFunction={powerUps.ninja.onSelectFunction}
        />

        <PowerUpCard
          title={powerUps.ninja.title}
          description={powerUps.ninja.description}
          onSelectFunction={powerUps.ninja.onSelectFunction}
        />
      </div>
      <p className="text-2xl mt-8 animate-pulse">Press any key to continue</p>
    </div>
  );
}
