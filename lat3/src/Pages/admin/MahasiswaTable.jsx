export default function MahasiswaTable({ data = [], onDetail, onEdit, onDelete }) {
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
                {data.map((m) => (
                    <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm text-slate-500">Mahasiswa</div>
                                <div className="mt-1 font-semibold text-slate-900 truncate">{m.nama}</div>
                                <div className="mt-2 space-y-1 text-sm text-slate-600">
                                    <div><span className="font-medium">NIM:</span> {m.nim}</div>
                                    <div><span className="font-medium">ID:</span> {m.id}</div>
                                </div>
                            </div>
                            <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-100 grid place-items-center">🎓</div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onDetail?.(m.id)}
                                className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
                            >
                                Detail
                            </button>
                            <button
                                type="button"
                                onClick={() => onEdit?.(m)}
                                className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete?.(m.id)}
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
            <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-5 py-3 text-left whitespace-nowrap">ID</th>
                                <th className="px-5 py-3 text-left whitespace-nowrap">NIM</th>
                                <th className="px-5 py-3 text-left">Nama</th>
                                <th className="px-5 py-3 text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((m) => (
                                <tr key={m.id} className="border-t border-slate-100">
                                    <td className="px-5 py-3 whitespace-nowrap">{m.id}</td>
                                    <td className="px-5 py-3 font-medium text-slate-800 whitespace-nowrap">{m.nim}</td>
                                    <td className="px-5 py-3">{m.nama}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onDetail?.(m.id)}
                                                className="rounded-xl border px-3 py-1 hover:bg-slate-50 whitespace-nowrap"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(m)}
                                                className="rounded-xl border px-3 py-1 hover:bg-slate-50 whitespace-nowrap"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(m.id)}
                                                className="rounded-xl border border-red-300 text-red-600 px-3 py-1 hover:bg-red-50 whitespace-nowrap"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50">
                                <td className="px-5 py-3 text-slate-600" colSpan={4}>
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
