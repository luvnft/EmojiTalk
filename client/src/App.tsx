import "./App.css";
import { Route, Routes } from "react-router-dom";
import Intro from "./assets/pages/Intro";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={<Intro />}
          />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
