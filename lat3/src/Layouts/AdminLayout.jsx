import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  const base =
    "flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-100";
  const active = "bg-slate-900 text-white";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 hidden md:block bg-white border-r border-slate-200 min-h-screen p-4">
          <div className="px-3 pb-4 border-b border-slate-200">
            <div className="inline-flex items-center gap-3">
              <span className="inline-flex w-9 h-9 rounded-xl bg-slate-900 items-center justify-center text-white">⌘</span>
              <span className="text-lg font-semibold">Admin Panel</span>
            </div>
          </div>

          <nav className="mt-4 space-y-1 text-sm">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              <span>🏠</span> Dashboard
            </NavLink>
            <NavLink
              to="/admin/mahasiswa"
              className={({ isActive }) => `${base} ${isActive ? active : ""}`}
            >
              <span>🎓</span> Mahasiswa
            </NavLink>
          </nav>

          <div className="mt-6">
            <button
              onClick={logout}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-left hover:bg-slate-50"
            >
              Keluar
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4">
            <h1 className="text-lg font-semibold">Admin</h1>
          </header>

          {/* Outlet child */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
