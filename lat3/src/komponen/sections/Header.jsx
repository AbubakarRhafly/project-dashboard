import Button from "../ui/Button.jsx";

export default function Header({ title = "Users", onAdd }) {
    return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <h1 className="text-lg sm:text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:block">
            <label className="relative">
                <input type="text" placeholder="Search..." className="w-64 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 pl-3 pr-3 py-2 focus:border-slate-900 dark:focus:border-slate-300 focus:ring-slate-900/20 dark:focus:ring-slate-300/20" />
            </label>
            </div>
            <Button onClick={onAdd}>Add User</Button>
        </div>
        </div>
    </header>
    );
}
