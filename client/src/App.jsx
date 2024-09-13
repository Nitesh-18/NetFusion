// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

const App = () => {
  return (
    <div className="font-body text-secondary">
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

export default App;
