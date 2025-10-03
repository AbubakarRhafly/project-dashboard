export default function Button({ as: Tag = "button", variant = "primary", className = "", ...props }) {
    const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
    const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    outline: "border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800"
    };
    return <Tag className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
