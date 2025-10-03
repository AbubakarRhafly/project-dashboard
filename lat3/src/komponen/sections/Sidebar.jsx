import { useState } from "react";
import Button from "../ui/Button.jsx";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    return (
    <>
        <div className="lg:hidden p-2">
        <Button variant="outline" onClick={() => setOpen(true)} className="w-10 h-10 px-0">☰</Button>
        </div>

        <aside className={[
            "fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 lg:static lg:shadow-none"
        ].join(" ")}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
            <span className="inline-flex w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-100 items-center justify-center text-white dark:text-slate-900">⌘</span>
            <span className="text-lg font-semibold">Admin Panel</span>
            </div>
            <Button className="lg:hidden" variant="ghost" onClick={() => setOpen(false)}>✕</Button>
        </div>

        <nav className="p-4 space-y-1 text-sm">
            {[
            { name: "Dashboard", icon: "🏠", active: true },
            { name: "Users", icon: "👤" },
            { name: "Orders", icon: "🧾" },
            { name: "Settings", icon: "⚙️" }
            ].map((item) => (
            <a key={item.name} href="#" className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/70 ${item.active ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : ""}`}>
                <span>{item.icon}</span>{item.name}
            </a>
            ))}
        </nav>

        <div className="mt-auto p-4 text-xs text-slate-500 dark:text-slate-400 hidden lg:block">© 2025 Company</div>
        </aside>
    </>
    );
}
