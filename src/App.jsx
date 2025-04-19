import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./Interface/MainMenu";
import Scene from "./Interface/Scene";
import Menu from "./Interface/Menu";
import GSAP_Practice from "./Interface/GSAP_Practice";
// import Settings from './Settings';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<GSAP_Practice />} /> */}
                <Route path="/" element={<Menu />} />
                <Route path="/scene" element={<Scene />} />
                {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
