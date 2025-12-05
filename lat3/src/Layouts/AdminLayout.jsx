import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmLogout } from "../Utils/Helpers/SwalHelpers.jsx";
import { toastSuccess } from "../Utils/Helpers/ToastHelpers.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    const ok = await confirmLogout();
    if (!ok) return;

    localStorage.removeItem("auth");
    toastSuccess("Berhasil logout.");
    navigate("/login", { replace: true });
  };

  const Sidebar = (
    <aside className="w-72 min-h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="p-5 border-b border-slate-200">
        <div className="inline-flex items-center gap-3">
          <span className="inline-flex w-9 h-9 rounded-xl bg-slate-900 text-white items-center justify-center">⌘</span>
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {/* MENU DASHBOARD */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`
          }
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>

        {/* MENU MAHASISWA */}
        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`
          }
        >
          <span>🎓</span>
          <span>Mahasiswa</span>
        </NavLink>

        {/* MENU DOSEN */}
        <NavLink
          to="/admin/dosen"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`
          }
        >
          <span>👩‍🏫</span>
          <span>Dosen</span>
        </NavLink>

        {/* MENU MATA KULIAH */}
        <NavLink
          to="/admin/matakuliah"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`
          }
        >
          <span>📚</span>
          <span>Mata Kuliah</span>
        </NavLink>

        {/* (opsional) JADWAL */}
        <NavLink
          to="/admin/jadwal"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`
          }
        >
          <span>🗓️</span>
          <span>Jadwal</span>
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <button
          onClick={logout}
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-left hover:bg-slate-50"
        >
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">{Sidebar}</div>

      {/* Drawer Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition ${open ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"
            }`}
        />
        {/* Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white border-r border-slate-200 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {Sidebar}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center px-4">
          {/* hamburger mobile */}
          <button
            className="md:hidden mr-2 inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-lg font-semibold">Admin</h1>
          <div className="ml-auto inline-flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:inline">Hi, Admin</span>
            <div className="inline-flex w-8 h-8 rounded-full bg-slate-300" />
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
