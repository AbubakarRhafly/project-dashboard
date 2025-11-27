// src/pages/admin/MahasiswaTable.jsx
export default function MahasiswaTable({ data = [], onDetail, onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-5 py-3 text-left">ID</th>
                        <th className="px-5 py-3 text-left">NIM</th>
                        <th className="px-5 py-3 text-left">Nama</th>
                        <th className="px-5 py-3 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((m) => (
                        <tr key={m.id} className="border-t border-slate-100">
                            <td className="px-5 py-3">{m.id}</td>
                            <td className="px-5 py-3 font-medium text-slate-800">{m.nim}</td>
                            <td className="px-5 py-3">{m.nama}</td>
                            <td className="px-5 py-3 space-x-2">
                                <button type="button" onClick={() => onDetail?.(m.id)} className="rounded-xl border px-3 py-1 hover:bg-slate-50">Detail</button>
                                <button type="button" onClick={() => onEdit?.(m)} className="rounded-xl border px-3 py-1 hover:bg-slate-50">Edit</button>
                                <button type="button" onClick={() => onDelete?.(m.id)} className="rounded-xl border border-red-300 text-red-600 px-3 py-1 hover:bg-red-50">Hapus</button>
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-slate-50">
                        <td className="px-5 py-3 text-slate-600" colSpan={4}>Total: {data.length} data</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
