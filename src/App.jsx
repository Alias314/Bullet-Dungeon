import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Scene from "./Interface/Scene";
import Menu from "./Interface/Menu";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/scene" element={<Scene />} />
            </Routes>
        </Router>
    );
};

export default App;
