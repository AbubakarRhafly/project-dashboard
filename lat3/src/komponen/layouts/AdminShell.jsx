import Sidebar from "../sections/Sidebar.jsx";
import Header from "../sections/Header.jsx";
import Footer from "../sections/Footer.jsx";

export default function AdminShell({ title, onAdd, children }) {
    return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
            <Header title={title} onAdd={onAdd} />
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <Footer />
        </div>
        </div>
    </div>
    );
}
