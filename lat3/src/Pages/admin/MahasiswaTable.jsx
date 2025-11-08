import { Link } from "react-router-dom";
import { confirmDeleteMahasiswa } from "../../Utils/Helpers/SwalHelpers.jsx";

export default function MahasiswaTable({ mahasiswa, openEditModal, onDelete }) {
    const handleDelete = async (m) => {
        const ok = await confirmDeleteMahasiswa(m.nama, m.nim);
        if (!ok) return;

        if (typeof onDelete === "function") {
            onDelete(m.nim);
        }
    };

    if (!mahasiswa || mahasiswa.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Belum ada data mahasiswa.</p>
            </div>
        );
    }

    const total = mahasiswa.length;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-5 py-3 text-left">NIM</th>
                        <th className="px-5 py-3 text-left">Nama</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {mahasiswa.map((m) => (
                        <tr key={m.nim} className="border-t border-slate-100">
                            <td className="px-5 py-3 font-medium text-slate-800">{m.nim}</td>
                            <td className="px-5 py-3">{m.nama}</td>
                            <td className="px-5 py-3">
                                {m.status ? (
                                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
                                        Tidak Aktif
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-3 space-x-2">
                                <Link
                                    to={`/admin/mahasiswa/${encodeURIComponent(m.nim)}`}
                                    className="rounded-xl border border-slate-300 px-3 py-1 hover:bg-slate-50"
                                >
                                    Detail
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => openEditModal && openEditModal(m.nim)}
                                    className="rounded-xl border border-slate-300 px-3 py-1 hover:bg-slate-50"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(m)}
                                    className="rounded-xl border border-red-300 text-red-600 px-3 py-1 hover:bg-red-50"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-slate-50">
                        <td className="px-5 py-3 text-slate-600" colSpan={4}>
                            Total: {total} data
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
