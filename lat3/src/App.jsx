import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Mahasiswa from "./pages/admin/Mahasiswa.jsx";
import MahasiswaDetail from "./pages/admin/MahasiswaDetail.jsx";
import Kelas from "./pages/admin/Kelas.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* ⬇️ ini rutenya */}
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />
          <Route path="kelas" element={<Kelas />} />
          <Route path="dosen" element={<Dosen />} />
          <Route path="matakuliah" element={<MataKuliah />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
