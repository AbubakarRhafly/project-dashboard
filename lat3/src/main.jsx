import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// layouts
import AdminLayout from "./layouts/AdminLayout.jsx";

// pages
import Mahasiswa from "./pages/admin/Mahasiswa.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Dosen from "./pages/admin/Dosen.jsx";
import MataKuliah from "./pages/admin/MataKuliah.jsx";
import Jadwal from "./pages/admin/Jadwal.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />, // kalau punya ProtectedRoute -> bungkus di sana
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <MataKuliah /> },
      { path: "jadwal", element: <Jadwal /> },
      { path: "mahasiswa", element: <Mahasiswa /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </React.StrictMode>
);
