export default function Input({ className = "", ...props }) {
    const base = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-slate-900 dark:focus:border-slate-300 focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-slate-300/20";
    return <input className={`${base} ${className}`} {...props} />;
}
