import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />

      {/* Opsional: buat ngecek query/mutation */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
