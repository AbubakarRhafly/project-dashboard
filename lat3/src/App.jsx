import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './App.css'
import Home from "./Pages/Home.jsx";
import Login from "./Pages/login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Login />
  </StrictMode>
);