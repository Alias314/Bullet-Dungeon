import { useState } from "react";

// yea this suppose to be in a UI elements component or something but imma just place it here for now
export function HealthBar() {
    const [health, setHealth] = useState(5);
    
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

// so basically imma put the game mechanics here but gonna do it later
export default function Game() {
    return (
        <div>

        </div>
    );
}