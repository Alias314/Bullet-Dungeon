import { useEffect, useState } from "react";
import PowerUpCard from "./PowerUpCard";
import { Vector3 } from "three";
import { usePowerUpStore } from "./Logic/usePowerUpStore";

export default function PowerUpOverlay({
  displayPowerUpOverlay,
  setDashBar,
  dashCooldown,
  maxDashBar,
  playerRef,
  setDashShield,
}) {
  const setPowerUp = usePowerUpStore((state) => state.setPowerUp);

  const ninja = () => {
    setPowerUp("ninja", true);
  };

  const closeOverlay = () => {
    displayPowerUpOverlay(false);
  };

  const dashShield = () => {
    setPowerUp("dashShield", true);
  };

  const radialBullet = () => {
    setPowerUp("radialBullet", true);
  };

  const powerUps = {
    ninja: {
      title: "Ninja",
      description: "Double the amount of dashes and halves the dash cooldown.",
      image: "running-ninja.svg",
      onSelectFunction: ninja,
    },
    radialBullet: {
      title: "Radial Bullet",
      description: "Shoot an array of bullets around you every 3 seconds",
      image: "icicles-aura.svg",
      onSelectFunction: radialBullet,
    },
    dashShield1: {
      title: "Dash Shield",
      description: "Summons a shield around you when you dash",
      image: "surrounded-shield.svg",
      onSelectFunction: dashShield,
    },
    dashShield2: {
      title: "Dash Shield",
      description: "Summons a shield around you when you dash",
      image: "surrounded-shield.svg",
      onSelectFunction: dashShield,
    },
  };

  const keys = Object.keys(powerUps);
  const [isUsedKey, setIsUsedKey] = useState({});
  let randomKey = keys[Math.floor(Math.random() * keys.length)];

  while (Object.keys(isUsedKey).length < 4) {
    if (isUsedKey[randomKey]) {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
    } else {
      isUsedKey[randomKey] = 1;
    }
  }

  const [amountReroll, setAmountReroll] = useState(10);
  const reroll = () => {
    if (amountReroll > 0) {
      setIsUsedKey({});
      setAmountReroll((prev) => prev - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 gap-10 opacity-90">
      <h2 className="text-5xl text-white font-bold mb-4">Choose Power Up</h2>
      <div className="flex gap-10 text-black">
        {Object.keys(isUsedKey).map((key) => (
          <PowerUpCard
            key={key}
            title={powerUps[key].title}
            description={powerUps[key].description}
            image={powerUps[key].image}
            onSelectFunction={() => {
              powerUps[key].onSelectFunction();
              closeOverlay();
            }}
          />
        ))}
      </div>

      <button
        onClick={reroll}
        className="px-6 py-2 bg-white text-5xl font-semibold rounded-2xl hover:bg-gray-400"
      >
        Reroll ({amountReroll})
      </button>
    </div>
  );
}
