// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SetupProfilePage from "./pages/SetupProfilePage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="font-body text-secondary">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/setup-profile" element={<SetupProfilePage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
      <ToastContainer
        position="top-right" // You can adjust position
        autoClose={3500} // Close after 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
