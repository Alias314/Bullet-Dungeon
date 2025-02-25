import { useState } from "react";

// yea this suppose to be in a UI elements component or something but imma just place it here for now
export function HealthBar({ health }) {
  return (
    <div className="absolute top-2 left-2 bg-red-500 p-2 text-white text-2xl font-semibold">
      Health: {health}
    </div>
  );
}

// this too
export function ManaBar() {
  const [mana, setMana] = useState(160);

  return (
    <div className="absolute top-15 left-2 bg-blue-500 p-2 text-white text-2xl font-semibold">
      Mana: {mana}
    </div>
  );
}

// and this too
export function DashBar({ dashBar }) {
  // const [mana, setMana] = useState(160);

  return (
    <div className="absolute top-15 left-2 bg-blue-500 p-2 text-white text-2xl font-semibold">
      Dashes: {dashBar}
    </div>
  );
}

export function Hotbar({ selectedWeapon }) {
  return (
    <div className="absolute flex left-[30%] bottom-2 gap-1">
      <div className={`p-5 font-semibold bg-black border ${selectedWeapon === 'pistol' ? 'text-yellow-500 2px solid gold' : 'text-white border-2 border-solid border-white'}`}>
        Pistol (1)
      </div>

      <div className={`p-5 font-semibold bg-black border ${selectedWeapon === 'shotgun' ? 'text-yellow-500 2px solid gold' : 'text-white border-2 border-solid border-white'}`}>
        Shotgun (2)
      </div>

      <div className={`p-5 font-semibold bg-black border ${selectedWeapon === 'minigun' ? 'text-yellow-500 2px solid gold' : 'text-white border-2 border-solid border-white'}`}>
        Minigun (3)
      </div>

      <div className={`p-5 font-semibold bg-black border ${selectedWeapon === 'railgun' ? 'text-yellow-500 2px solid gold' : 'text-white border-2 border-solid border-white'}`}>
        Railgun (4) WIP
      </div>
    </div>
  );
}

// so basically imma put the game mechanics here but gonna do it later
export default function Game() {
  return <div></div>;
}
