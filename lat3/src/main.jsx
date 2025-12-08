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
import Users from "./pages/admin/Users.jsx";

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
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <MataKuliah /> },
      { path: "jadwal", element: <Jadwal /> },
      { path: "mahasiswa", element: <Mahasiswa /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        // bikin lama banget biar gampang SS 😄
        duration: 12000, // 12 detik default
        success: { duration: 9000 },
        error: { duration: 12000 },
        style: {
          zIndex: 999999,
          fontSize: "14px",
          padding: "12px 14px",
        },
      }}
    />
    <RouterProvider router={router} />
  </React.StrictMode>
);
