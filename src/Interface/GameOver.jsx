import React from "react";

const GameOver = () => {
    const handleRestart = () => {
        window.location.reload();
    };

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
            <h1 className="text-6xl text-red-700 font-extrabold mb-8 font-title tracking-wide">YOU DIED!</h1>

            <button
                onClick={handleRestart}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold w-45 py-2 px-4 rounded mb-4 font-title text-3xl cursor-pointer transition-colors duration-200 border-2 border-stone-600"
            >
                Restart
            </button>
        </div>
    );
};

export default GameOver;
