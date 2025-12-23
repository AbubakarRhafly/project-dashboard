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

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
      ? "bg-indigo-600 text-white shadow-sm"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700"
    }`;

  const Sidebar = (
    <aside className="w-72 h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="p-5 border-b border-slate-200">
        <div className="inline-flex items-center gap-3">
          <span className="inline-flex w-9 h-9 rounded-xl bg-slate-900 text-white items-center justify-center">
            ⌘
          </span>
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
      </div>

      {/* nav: kasih padding biar rapi + bisa scroll jika menu banyak */}
      <nav className="p-4 space-y-2 overflow-y-auto">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/mahasiswa" className={linkClass}>
          <span>🎓</span>
          <span>Mahasiswa</span>
        </NavLink>

        <NavLink to="/admin/dosen" className={linkClass}>
          <span>👩‍🏫</span>
          <span>Dosen</span>
        </NavLink>

        <NavLink to="/admin/matakuliah" className={linkClass}>
          <span>📚</span>
          <span>Mata Kuliah</span>
        </NavLink>

        <NavLink to="/admin/jadwal" className={linkClass}>
          <span>🗓️</span>
          <span>Jadwal</span>
        </NavLink>

        <NavLink to="/admin/kelas" className={linkClass}>
          <span>🏫</span>
          <span>Kelas</span>
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <span>👥</span>
          <span>Users</span>
        </NavLink>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-left hover:bg-slate-50 transition"
        >
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex overflow-x-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:block shrink-0">{Sidebar}</div>

      {/* Drawer Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"
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
          className={`absolute left-0 top-0 h-full w-72 transform transition-transform duration-200 ease-out ${open ? "translate-x-0" : "-translate-x-full"
            }`}
          role="dialog"
          aria-modal="true"
        >
          {/* biar sidebar bisa scroll di mobile dan gak kepotong */}
          <div className="h-full overflow-y-auto">{Sidebar}</div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center min-w-0">
            {/* hamburger mobile */}
            <button
              className="md:hidden mr-2 inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg font-semibold truncate">Admin</h1>

            <div className="ml-auto inline-flex items-center gap-3 min-w-0">
              <span className="text-sm text-slate-500 hidden sm:inline truncate">
                Hi, Admin
              </span>
              <div className="inline-flex w-8 h-8 rounded-full bg-slate-300 shrink-0" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
          {/* min-w-0 penting biar komponen/table gak ngebobol layout */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
