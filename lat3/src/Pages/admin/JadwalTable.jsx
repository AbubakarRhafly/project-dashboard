export default function JadwalTable({ data, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto rounded-2xl bg-white shadow border border-slate-200">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Kode MK</th>
                        <th className="px-4 py-3 text-left">Hari</th>
                        <th className="px-4 py-3 text-left">Jam</th>
                        <th className="px-4 py-3 text-left">Ruang</th>
                        <th className="px-4 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={6}>Belum ada data</td></tr>
                    ) : data.map((row) => (
                        <tr key={row.id} className="border-t">
                            <td className="px-4 py-3">{row.id}</td>
                            <td className="px-4 py-3">{row.kode}</td>
                            <td className="px-4 py-3">{row.hari}</td>
                            <td className="px-4 py-3">{row.jam}</td>
                            <td className="px-4 py-3">{row.ruang}</td>
                            <td className="px-4 py-3 text-right">
                                <button type="button" onClick={() => onEdit(row)} className="px-3 py-1 rounded-xl border mr-2">Edit</button>
                                <button type="button" onClick={() => onDelete(row.id)} className="px-3 py-1 rounded-xl border text-red-600">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
