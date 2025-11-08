import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

import Login from "./pages/login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Mahasiswa from "./pages/admin/Mahasiswa.jsx";            // ← HALAMAN BARU
import MahasiswaDetail from "./pages/admin/MahasiswaDetail.jsx";
import PageNotFound from "./Error/PageNotFound.jsx";

import "./App.css";

const router = createBrowserRouter([
  // redirect root ke /login
  { path: "/", element: <Navigate to="/login" replace /> },

  // Auth layout + login (public)
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },

  // Protected + Admin layout (nested)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,           // ← DI SINI ADA SIDEBAR + HEADER
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },

          // ==== MAHASISWA (PAKAI FILE BARU) ====
          { path: "mahasiswa", element: <Mahasiswa /> },
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
    <Toaster position="top-right" /> {/* Toast global */}
  </React.StrictMode>
);

