import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
    const location = useLocation();
    let authed = false;
    try {
        authed = !!JSON.parse(localStorage.getItem("auth") || "{}")?.email;
    } catch { }

    // If already logged in, go to /admin (NOT /admin/… again)
    if (authed) return <Navigate to="/admin" replace state={{ from: location }} />;

    return <Outlet />;
}
