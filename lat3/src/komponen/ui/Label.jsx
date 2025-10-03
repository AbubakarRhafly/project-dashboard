export default function Label({ children, className = "", ...props }) {
    return (
    <label className={`block ${className}`} {...props}>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">{children}</span>
    </label>
    );
}
