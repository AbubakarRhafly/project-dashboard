export default function KelasTable({ rows = [], onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border bg-white shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="p-3 border-b">MK</th>
                            <th className="p-3 border-b">SKS</th>
                            <th className="p-3 border-b">Dosen</th>
                            <th className="p-3 border-b">Mahasiswa</th>
                            <th className="p-3 border-b">Info</th>
                            <th className="p-3 border-b text-right">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-slate-500">
                                    Belum ada kelas
                                </td>
                            </tr>
                        ) : (
                            rows.map((k) => (
                                <tr key={k.id} className="border-t hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-medium text-slate-900">{k.mkNama}</div>
                                        <div className="text-xs text-slate-500">{k.mkKode}</div>
                                    </td>
                                    <td className="p-3">{k.mkSks}</td>
                                    <td className="p-3">
                                        <div className="font-medium">{k.dosenNama}</div>
                                        <div className="text-xs text-slate-500">
                                            SKS dosen: {k.dosenSksUsed}/{k.dosenMaxSks}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium">{k.jumlahMahasiswa} orang</div>
                                        <div className="text-xs text-slate-500">
                                            (dipilih di kelas ini)
                                        </div>
                                    </td>
                                    <td className="p-3 text-xs text-slate-600">
                                        1 MK = 1 Kelas (1 dosen)
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={() => onEdit?.(k.raw)}
                                                className="px-3 py-1 rounded-xl border hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(k.raw.id)}
                                                className="px-3 py-1 rounded-xl border text-red-600 hover:bg-red-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
