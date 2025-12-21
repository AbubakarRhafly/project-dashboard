import { usePagination } from "../../Utils/Hooks/usePagination.jsx";
import TablePaginationFooter from "../../komponen/ui/TablePaginationFooter.jsx";

export default function MahasiswaTable(props) {
    // ✅ Aman: kalau kamu kirim data={...} atau mahasiswa={...} tetap kebaca
    const rows = Array.isArray(props.data)
        ? props.data
        : Array.isArray(props.mahasiswa)
            ? props.mahasiswa
            : [];

    const { onDetail, onEdit, onDelete } = props;

    const {
        page,
        perPage,
        totalRows,
        totalPages,
        startIndex,
        startLabel,
        endLabel,
        pagedData,
        canPrev,
        canNext,
        prev,
        next,
    } = usePagination(rows, { perPage: 5 });

    return (
        <div className="rounded-2xl border bg-white shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="p-3 border-b">No</th>
                            <th className="p-3 border-b">NIM</th>
                            <th className="p-3 border-b">Nama</th>
                            <th className="p-3 border-b text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pagedData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-slate-500">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            pagedData.map((mhs, index) => (
                                <tr key={mhs.id} className="hover:bg-slate-50">
                                    <td className="p-3 border-b">{startIndex + index + 1}</td>
                                    <td className="p-3 border-b">{mhs.nim}</td>
                                    <td className="p-3 border-b">{mhs.nama}</td>
                                    <td className="p-3 border-b text-center space-x-2">
                                        <button
                                            onClick={() => onDetail?.(mhs.id)}
                                            className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        >
                                            Detail
                                        </button>
                                        <button
                                            onClick={() => onEdit?.(mhs)}
                                            className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(mhs.id)}
                                            className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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
    );
}
