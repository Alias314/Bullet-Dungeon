import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./Interface/MainMenu";
import Scene from "./Interface/Scene";
// import Settings from './Settings';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/scene" element={<Scene />} />
                {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
