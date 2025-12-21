import { usePagination } from "../../Utils/Hooks/usePagination.jsx";
import TablePaginationFooter from "../../komponen/ui/TablePaginationFooter.jsx";

export default function MataKuliahTable({ data = [], onEdit, onDelete }) {
    const {
        page,
        perPage,
        totalRows,
        totalPages,
        startLabel,
        endLabel,
        pagedData,
        canPrev,
        canNext,
        prev,
        next,
    } = usePagination(Array.isArray(data) ? data : [], { perPage: 5 });

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                Belum ada data
            </div>
        );
    }

    return (
        <>
            {/* MOBILE: cards */}
            <div className="grid grid-cols-1 gap-3 sm:hidden">
                {pagedData.map((mk) => (
                    <div
                        key={mk.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm text-slate-500">Mata Kuliah</div>
                                <div className="mt-1 font-semibold text-slate-900 truncate">
                                    {mk.nama}
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-slate-600">
                                    <div>
                                        <span className="font-medium">Kode:</span> {mk.kode}
                                    </div>
                                    <div>
                                        <span className="font-medium">SKS:</span> {mk.sks}
                                    </div>
                                    <div>
                                        <span className="font-medium">ID:</span> {mk.id}
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 h-9 w-9 rounded-xl bg-slate-100 grid place-items-center">
                                📚
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit?.(mk)}
                                className="rounded-xl border px-3 py-1 text-sm hover:bg-slate-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete?.(mk.id)}
                                className="rounded-xl border border-red-300 text-red-600 px-3 py-1 text-sm hover:bg-red-50"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <TablePaginationFooter
                        totalRows={totalRows}
                        perPage={perPage}
                        startLabel={startLabel}
                        endLabel={endLabel}
                        page={page}
                        totalPages={totalPages}
                        canPrev={canPrev}
                        canNext={canNext}
                        onPrev={prev}
                        onNext={next}
                        showDivider={false}
                    />
                </div>
            </div>

            {/* DESKTOP/TABLET: table */}
            <div className="hidden sm:block rounded-2xl bg-white shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Kode MK</th>
                                <th className="px-4 py-3 text-left">Nama MK</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">SKS</th>
                                <th className="px-4 py-3 text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map((mk) => (
                                <tr key={mk.id} className="border-t">
                                    <td className="px-4 py-3 whitespace-nowrap">{mk.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{mk.kode}</td>
                                    <td className="px-4 py-3">{mk.nama}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{mk.sks}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(mk)}
                                                className="px-3 py-1 rounded-xl border hover:bg-slate-50 whitespace-nowrap"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(mk.id)}
                                                className="px-3 py-1 rounded-xl border text-red-600 hover:bg-red-50 whitespace-nowrap"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <TablePaginationFooter
                    totalRows={totalRows}
                    perPage={perPage}
                    startLabel={startLabel}
                    endLabel={endLabel}
                    page={page}
                    totalPages={totalPages}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={prev}
                    onNext={next}
                />
            </div>
        </>
    );
}
