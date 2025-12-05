export default function JadwalTable({ data = [], onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                Belum ada data
            </div>
        );
    }

    return (
        <>
            {/* MOBILE: cards (NO geser) */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
                {data.map((j) => (
                    <div key={j.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm text-slate-500">Jadwal</div>
                                <div className="mt-1 font-semibold text-slate-900 truncate">
                                    {j.kodeMk} • {j.hari}
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-slate-600">
                                    <div><span className="font-medium">Jam:</span> {j.jam}</div>
                                    <div><span className="font-medium">Ruang:</span> {j.ruang}</div>
                                    <div><span className="font-medium">ID:</span> {j.id}</div>
                                </div>
                            </div>
                            <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-100 grid place-items-center">🗓️</div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit?.(j)}
                                className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete?.(j.id)}
                                className="rounded-xl border border-red-300 text-red-600 px-3 py-1 text-sm hover:bg-red-50"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}

                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                    Total: {data.length} data
                </div>
            </div>

            {/* DESKTOP/TABLET: table */}
            <div className="hidden sm:block rounded-2xl bg-white shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Kode MK</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Hari</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Jam</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Ruang</th>
                                <th className="px-4 py-3 text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((j) => (
                                <tr key={j.id} className="border-t">
                                    <td className="px-4 py-3 whitespace-nowrap">{j.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{j.kodeMk}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{j.hari}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{j.jam}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{j.ruang}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(j)}
                                                className="px-3 py-1 rounded-xl border hover:bg-slate-50 whitespace-nowrap"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(j.id)}
                                                className="px-3 py-1 rounded-xl border text-red-600 hover:bg-red-50 whitespace-nowrap"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50">
                                <td className="px-4 py-3 text-slate-600" colSpan={6}>
                                    Total: {data.length} data
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
