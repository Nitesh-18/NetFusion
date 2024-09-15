// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SetupProfilePage from "./pages/SetupProfilePage";

const App = () => {
  return (
    <div className="font-body text-secondary">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/setup-profile" element={<SetupProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
