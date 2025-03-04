import React from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen text-white"
            style={{
                backgroundImage: `url(/assets/images/Dark_Background.jpg)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <img
                src="/assets/images/BD_Logo2_W.svg"
                alt="Bullet Dungeon Logo"
                className="w-56 mb-4"
            />
            {/* <h1 className="text-6xl font-bold mb-8 font-title">
                Bullet Dungeon
            </h1> */}
            <button
                onClick={() => navigate("/scene")}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold w-45 py-2 px-4 rounded mb-4 font-title text-3xl cursor-pointer transition-colors duration-200 border-2 border-stone-600"
            >
                Start Game
            </button>
            <button
                onClick={() => navigate("/settings")}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold w-45 py-2 px-4 rounded font-title text-3xl cursor-pointer transition-colors duration-200 border-2 border-stone-600"
            >
                Settings
            </button>
        </div>
    );
};

export default MainMenu;
