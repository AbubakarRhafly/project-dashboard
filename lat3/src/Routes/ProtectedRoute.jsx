import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const auth = localStorage.getItem("auth"); // <- harus 'auth'
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
