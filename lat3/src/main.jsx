// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";              // ⬅️ tambahkan

import "./App.css";

// Layouts / Routes
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
// import ProtectedRoute from "./Routes/ProtectedRoute.jsx"; // kalau belum ada, biarkan ter-comment

// Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Mahasiswa from "./pages/admin/Mahasiswa.jsx";
import MahasiswaDetail from "./pages/admin/MahasiswaDetail.jsx";

// (opsional) 404 page
// import PageNotFound from "./Error/PageNotFound.jsx";

const router = createBrowserRouter([
  // AUTH
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "/login", element: <Login /> },
    ],
  },

  // ADMIN (tanpa guard; kalau punya ProtectedRoute, bungkus dengan element:<ProtectedRoute />)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },

      // ➜ Rute Mahasiswa
      { path: "mahasiswa", element: <Mahasiswa /> },
      { path: "mahasiswa/:id", element: <MahasiswaDetail /> },
    ],
  },

  // fallback 404 (opsional)
  // { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-right" toastOptions={{ duration: 2500 }} /> {/* ⬅️ penting */}
  </React.StrictMode>
);
