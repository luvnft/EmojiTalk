import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Intro from "./assets/pages/Intro";
import Register from "./assets/pages/Register";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Intro />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
