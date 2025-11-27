import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  let authed = false;
  try {
    authed = !!JSON.parse(localStorage.getItem("auth") || "{}")?.email;
  } catch {}

  if (!authed) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
