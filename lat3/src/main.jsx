import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Login from "./pages/login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import MahasiswaList from "./pages/admin/MahasiswaList.jsx";
import MahasiswaDetail from "./pages/admin/MahasiswaDetail.jsx";
import PageNotFound from "./Error/PageNotFound.jsx";

import "./App.css";

const router = createBrowserRouter([
  // Auth layout + login
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "/login", element: <Login /> },
    ],
  },

  // Protected + Admin layout (nested)
  {
    element: <ProtectedRoute />, // cek localStorage
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
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
