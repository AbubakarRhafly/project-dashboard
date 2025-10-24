// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// ⬇️ pastikan file ini ada di "./routes/ProtectedRoute.jsx" dan versinya pakai <Outlet />
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Login from "./pages/login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import MahasiswaList from "./pages/admin/MahasiswaList.jsx";
import MahasiswaDetail from "./pages/admin/MahasiswaDetail.jsx";
import PageNotFound from "./Error/PageNotFound.jsx";

import "./App.css";

const router = createBrowserRouter([
  // Root → /login (biar aman kalau buka "/")
  { path: "/", element: <Navigate to="/login" replace /> },

  // Auth layout + login (public)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
    ],
  },

  // Protected + Admin layout (nested)
  {
    element: <ProtectedRoute />, // ← ProtectedRoute HARUS return <Outlet /> kalau authed, <Navigate/> kalau tidak
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> }, // /admin → /admin/dashboard
          { path: "dashboard", element: <Dashboard /> },
          { path: "mahasiswa", element: <MahasiswaList /> },
          { path: "mahasiswa/:id", element: <MahasiswaDetail /> },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
