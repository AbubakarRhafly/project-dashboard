export default function Card({ title, actions, children, className = "" }) {
    return (
    <section className={`rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
        {(title || actions) && (
        <div className="px-6 py-4 flex items-center justify-between">
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {actions}
        </div>
        )}
        <div className="px-6 py-4">{children}</div>
    </section>
    );
}
