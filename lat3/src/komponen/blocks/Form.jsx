export default function Form({ onSubmit, className = "", children, ...props }) {
    return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} {...props}>
        {children}
    </form>
    );
}
