import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./Interface/MainMenu";
import Game from "./Interface/Game";
// import Settings from './Settings';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/game" element={<Game />} />
                {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
